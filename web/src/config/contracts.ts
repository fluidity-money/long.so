import z from "zod";
import { allChains } from "./chains";
import AMMContract from "./abi/ISeawaterAMM";
import LeoContract from "./abi/ILeo";
import appConfig from "./app";
import OwnershipNFTsContract from "./abi/IOwnershipNFTs";

const contractTypes = ["amm", "leo", "ownershipNFTs"] as const;
type ContractTypes = (typeof contractTypes)[number];
type ChainIdTypes = (typeof allChains)[number]["id"];

const contractAbis = {
  amm: AMMContract,
  leo: LeoContract,
  ownershipNFTs: OwnershipNFTsContract,
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
  },
  98985: {
    amm: { address: "0x3d37c3f4a7c773243f9FC31a891911D39d5A75fE" },
    leo: { address: "0x5b3d9c7effafc0da1ec98f5abdd96f72124b81d6" },
    ownershipNFTs: { address: "0x7ad12ef3578d5eb845883d156d8dfb2ea39448b5" },
  },
  421614: {
    amm: { address: "0xe89E8Cb7E84Dd1b4460cF2a51B3f0B05Ff952bB6" },
    leo: { address: appConfig.nullAddress },
    ownershipNFTs: { address: appConfig.nullAddress },
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
