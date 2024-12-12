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
    amm: { address: "0x2B82dA1C1Be91eE6cF7aec0A37E38aD39fF4A87D" },
    leo: { address: "0x18cd0c5907574107C6ce73B10703150AB2e88E50" },
    ownershipNFTs: { address: "0xCbaEe72552E80d23026037ef0F489B97863C431e" },
    positionHandler: { address: "0x3511aF458F39cF609719070636B033A07F327C29" },
  },
  55244: {
    amm: { address: "0x452D796b656D3720f2d06B3439eF95899f0db755" },
    leo: { address: "0x815e104dCe7e818211A06962b917Fd115eb71fc9" },
    ownershipNFTs: { address: "0x1C3D5CF4F56af1cB8f810F49eFfF3d5970a274D0" },
    positionHandler: { address: "0xc81915AF9ba5477eD31e71CbEc8955636D55B730" },
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
