import z from "zod";
import { superpositionMainnet } from "./chains";

const appSchema = z.object({
  /**
   * Generated metadata of the web app and wagmi will use this object
   */
  metadata: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().url(),
    icons: z.array(z.string()),
  }),
  pointsGraphUrl: z.string().url(),
  codexApiUrl: z.string().url(),
  nullAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]+$/, {
      message:
        "Invalid hex string. It must start with '0x' and contain only hexadecimal characters.",
    })
    .length(42, {
      message:
        "Address must be exactly 42 characters long, including the '0x' prefix.",
    }),
  pairs: z.array(
    z.object({
      pair: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/, {
          message:
            "Invalid hex string. It must start with '0x' and contain only hexadecimal characters.",
        })
        .length(42, {
          message:
            "Address must be exactly 42 characters long, including the '0x' prefix.",
        }),
      quoteToken0: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/, {
          message:
            "Invalid hex string. It must start with '0x' and contain only hexadecimal characters.",
        })
        .length(42, {
          message:
            "Address must be exactly 42 characters long, including the '0x' prefix.",
        }),
      quoteToken1: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/, {
          message:
            "Invalid hex string. It must start with '0x' and contain only hexadecimal characters.",
        })
        .length(42, {
          message:
            "Address must be exactly 42 characters long, including the '0x' prefix.",
        }),
      createdAt: z.date(),
      networkId: z.number(),
      name: z.string(),
    }),
  ),
});

type AppSchemaType = z.infer<typeof appSchema>;

const appVars = appSchema.safeParse({
  metadata: {
    name: "Longtail",
    description: "",
    url: "https://long.so",
    icons: [""],
  },
  pointsGraphUrl: "https://points-graph.superposition.so",
  codexApiUrl: "https://graph.codex.io/graphql",
  nullAddress: "0x0000000000000000000000000000000000000000",
  pairs: [
    {
      pair: "0x7fc956a5c0aef46aa25b8911f4cb4619cbb7d90f",
      networkId: superpositionMainnet.id,
      name: "WETH/USDC.e",
      createdAt: new Date("2025-02-01 21:39:58"),
      quoteToken0: "0x1fb719f10b56d7a85dcd32f27f897375fb21cfdd",
      quoteToken1: "0x6c030c5cc283f791b26816f325b9c632d964f8a1",
    },
  ],
});

if (!appVars.success) {
  console.error("Invalid app config variables: ", appVars.error.name);
  throw new Error(appVars.error.message);
}

export default appVars.data as AppSchemaType & { nullAddress: `0x${string}` };
