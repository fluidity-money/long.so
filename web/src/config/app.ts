import z from "zod";

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
});

type AppSchemaType = z.infer<typeof appSchema>;

const appVars = appSchema.safeParse({
  metadata: {
    name: "Longtail",
    description: "",
    url: "https://long.so",
    icons: [""],
  },
  nullAddress: "0x0000000000000000000000000000000000000000",
});

if (!appVars.success) {
  console.error("Invalid app config variables: ", appVars.error.name);
  throw new Error(appVars.error.message);
}

export default appVars.data as AppSchemaType & { nullAddress: `0x${string}` };
