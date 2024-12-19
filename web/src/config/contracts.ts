import z from "zod";
import { allChains } from "./chains";
import AMMContract from "./abi/ISeawaterAMM";
import LeoContract from "./abi/ILeo";
import appConfig from "./app";
import OwnershipNFTsContract from "./abi/IOwnershipNFTs";
import PositionHandlerContract from "./abi/PositionHandler";

const contractTypes = [
  "amm",
  "leo",
  "ownershipNFTs",
  "positionHandler",
] as const;
type ContractTypes = (typeof contractTypes)[number];
type ChainIdTypes = (typeof allChains)[number]["id"];

const contractAbis = {
  amm: AMMContract,
  leo: LeoContract,
  ownershipNFTs: OwnershipNFTsContract,
  positionHandler: PositionHandlerContract,
} as const;

const chainContracts: {
  [key in ChainIdTypes | "defaults"]: {
    [key in ContractTypes]?: {
      abi?: (typeof contractAbis)[key];
      address?: `0x${string}`;
    };
  };
} = {
  defaults: {
    amm: {
      abi: contractAbis.amm,
    },
    leo: {
      abi: contractAbis.leo,
    },
    ownershipNFTs: {
      abi: contractAbis.ownershipNFTs,
    },
    positionHandler: {
      abi: contractAbis.positionHandler,
    },
  },
  98985: {
    amm: { address: "0xAe86141e3f1C9168cE6c948FDC884F2A5f45d7B6" },
    leo: { address: "0xADA1629b77A4864340b7b9Dc4B9874068E844b08" },
    ownershipNFTs: { address: "0x8aa3750A7e8c98830e3421a89bFf80Fc175e4C98" },
    positionHandler: { address: "0x73387E7E4DF41f58Be13cdE4Dd4EAf3675c1C44c" },
  },
  55244: {
    amm: { address: "0x452D796b656D3720f2d06B3439eF95899f0db755" },
    leo: { address: "0xF3a2F99EDC730651428A490eDa4b1Fe4278bF0bb" },
    ownershipNFTs: { address: "0x42f104ed693792c858D03f987DfFB30e39cC1ce9" },
    positionHandler: { address: "0x46f9dea606a3D5890aD6d36C64acD55C26C51B8a" },
  },
};

const contractKey = <T extends ContractTypes>(sv: T, id: ChainIdTypes) =>
  ({
    ...chainContracts.defaults[sv],
    ...chainContracts[id][sv],
  }) as {
    abi: (typeof contractAbis)[T];
    address: `0x${string}`;
  };

export const contracts = allChains.reduce(
  (acc, v) => {
    acc[v.id] = contractTypes.reduce(
      (sacc, sv) => {
        // Typescript can't narrow sv without a condition, so use an exhaustive switch
        switch (sv) {
          case "amm":
            sacc[sv] = contractKey(sv, v.id);
            break;
          case "leo":
            sacc[sv] = contractKey(sv, v.id);
            break;
          case "ownershipNFTs":
            sacc[sv] = contractKey(sv, v.id);
            break;
          case "positionHandler":
            sacc[sv] = contractKey(sv, v.id);
            break;
          default:
            sv satisfies never;
        }

        return sacc;
      },
      {} as {
        [key in ContractTypes]: {
          abi: (typeof contractAbis)[key];
          address: `0x${string}`;
        };
      },
    );

    return acc;
  },
  {} as {
    [key in ChainIdTypes]: {
      [key in ContractTypes]: {
        abi: (typeof contractAbis)[key];
        address: `0x${string}`;
      };
    };
  },
);

export function useContracts(
  chainId: ChainIdTypes,
  contract?: never,
): (typeof contracts)[ChainIdTypes];
export function useContracts(
  chainId: ChainIdTypes,
  contract: ContractTypes,
): (typeof contracts)[ChainIdTypes][ContractTypes];

export function useContracts(chainId: ChainIdTypes, contract?: ContractTypes) {
  if (contract) return contracts[chainId][contract];
  return contracts[chainId];
}
export const getContractFromKey = (
  chainId: ChainIdTypes,
  contract: ContractTypes,
) => contracts[chainId][contract];

const contractValueSchema = z.object({
  abi: z.array(z.any()),
  address: z.string().regex(/^0x[a-fA-F0-9]+$/, {
    message:
      "Invalid hex string. It must start with '0x' and contain only hexadecimal characters.",
  }),
});

const contractTypeSchema = z.enum(contractTypes);
const contractSchema = z.record(contractTypeSchema, contractValueSchema);

const contractValidation = z
  .array(contractSchema)
  .safeParse(Object.values(contracts));
if (!contractValidation.success) {
  console.error("Invalid contracts: ", contractValidation.error.name);
  throw new Error(contractValidation.error.message);
}
