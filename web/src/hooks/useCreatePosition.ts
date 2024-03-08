import SeawaterABI from "../util/abi/SeawaterAMM";
import { encodeTick } from "../util/math";
import {
  prepareWriteContract,
  readContract,
  waitForTransaction,
  writeContract,
} from "wagmi/actions";
import { useAccount, usePublicClient } from "wagmi";
import { Hash, hexToBigInt, maxUint128, toHex } from "viem";
import { usePermit2 } from "../util/usePermit2";
import { FluidTokenAddress } from "../util/tokens";
import { useActiveTokenStore } from "@/stores/useActiveTokenStore";

interface UseCreatePosition {
  // returns id of new position
  createPosition: (
    lowerRange: number,
    upperRange: number,
    delta: bigint,
  ) => Promise<Hash | undefined>;
  removePosition: (id: bigint) => Promise<void>;
  updatePosition: (id: bigint, delta: bigint) => Promise<void>;
  collectFees: (id: bigint) => Promise<void>;
}

// TODO simulate for create/update position
const useCreatePosition = (): UseCreatePosition => {
  const { token0, ammAddress } = useActiveTokenStore();
  const { address } = useAccount();
  const client = usePublicClient();

  const { getPermit2Data } = usePermit2();

  // write the mintPosition action, then updatePosition using the pool ID
  // operates on the active token
  const createPosition = async (
    lowerRange: number,
    upperRange: number,
    delta: bigint,
  ) => {
    const { request: mintPositionRequest } = await prepareWriteContract({
      address: ammAddress,
      abi: SeawaterABI,
      functionName: "mintPosition",
      args: [token0, encodeTick(lowerRange), encodeTick(upperRange)],
    });

    const { hash: mintPositionHash } = await writeContract(mintPositionRequest);
    const receipt = await waitForTransaction({ hash: mintPositionHash });
    const mintPositionId = receipt.logs[0].topics[1];

    if (!mintPositionId) {
      throw new Error("Failed to fetch ID of new mint position!");
    }

    if (!address) return;

    await updatePosition(hexToBigInt(mintPositionId), delta);

    return mintPositionId;
  };

  /**
   * @description - update a position with the given ID, using permit2 if the delta is >0. Uses `token0` as the pool token
   * @param id - the ID of the position to update
   * @param delta - positive to add liquidity, negative to remove
   */
  const updatePosition = async (id: bigint, delta: bigint) => {
    const { request: updatePositionRequest, result: updatePositionResult } =
      await prepareWriteContract({
        address: ammAddress,
        abi: SeawaterABI,
        functionName: "updatePosition",
        args: [token0, id, delta],
      });

    // use permit2 if delta >0, otherwise there's nothing to permit
    if (delta > 0) {
      // derive maxAmount from simulated results
      // response is [token0, token1] where token0 is token0, token1 is fUSDC
      const [maxAmountToken0, maxAmountFusdc] = updatePositionResult;

      // the order matters - first sig must be token0, second fusdc
      const {
        sig: sig0,
        nonce: nonce0,
        encodedDeadline,
      } = (await getPermit2Data({
        token: token0,
        amount: maxAmountToken0,
      })) || {};
      if (!sig0 || !nonce0 || !encodedDeadline) {
        return;
      }

      const { sig: sig1, nonce: nonce1 } =
        (await getPermit2Data({
          token: FluidTokenAddress,
          amount: maxAmountFusdc,
          nonce: toHex(hexToBigInt(nonce0) + BigInt(1)),
        })) || {};
      if (!sig1 || !nonce1) {
        return;
      }

      const { request: updatePositionPermit2Request } =
        await prepareWriteContract({
          address: ammAddress,
          abi: SeawaterABI,
          functionName: "updatePositionPermit2",
          args: [
            token0,
            id,
            delta,
            hexToBigInt(nonce0),
            encodedDeadline,
            maxAmountToken0,
            sig0,
            hexToBigInt(nonce1),
            encodedDeadline,
            maxAmountFusdc,
            sig1,
          ],
        });

      await writeContract(updatePositionPermit2Request);
    } else {
      // write the precomputed request
      await writeContract(updatePositionRequest);
    }
  };

  /**
   * @description - remove a position with the given ID. Uses `token0` as the pool token. Clears all liquidity, then burns the position
   * @param id - the ID of the position to update
   */
  const removePosition = async (id: bigint) => {
    const positionLiquidity = await readContract({
      address: ammAddress,
      abi: SeawaterABI,
      // this function is not marked as a view, since it contains a delegate call
      // however it can be read using call, so ignore Wagmi's type error
      // @ts-expect-error
      functionName: "positionLiquidity",
      args: [token0, id],
    });

    // remove all liquidity
    await updatePosition(id, -positionLiquidity);

    // burn position
    const { request: burnPositionRequest } = await prepareWriteContract({
      address: ammAddress,
      abi: SeawaterABI,
      functionName: "burnPosition",
      args: [id],
    });

    await writeContract(burnPositionRequest);
  };

  /**
   * @description - collect fees from a position with the given ID. Uses `token0` as the pool token.
   * @param id - the ID of the position to collect fees from
   */
  const collectFees = async (id: bigint) => {
    // simulate first to return the amount to be collected TODO (or convert this to a simulated hook fn)
    const { request: collectRequest } = await prepareWriteContract({
      address: ammAddress,
      abi: SeawaterABI,
      functionName: "collect",
      args: [token0, id, maxUint128, maxUint128],
    });

    await writeContract(collectRequest);
  };

  return {
    createPosition,
    updatePosition,
    removePosition,
    collectFees,
  };
};

export { useCreatePosition };
