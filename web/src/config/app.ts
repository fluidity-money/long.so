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
  // Add more config variables here
});

const appVars = appSchema.safeParse({
  metadata: {
    name: "Longtail",
    description: "",
    url: "https://long.so",
    icons: [""],
  },
});

if (!appVars.success) {
  console.error("Invalid app config variables: ", appVars.error.name);
  throw new Error(appVars.error.message);
}

export default appVars.data;
