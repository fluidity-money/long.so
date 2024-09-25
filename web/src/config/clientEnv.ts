import z from "zod";

const clientEnvSchema = z.object({
  /**
   * Walletconnect project id.
   */
  NEXT_PUBLIC_LONGTAIL_WALLETCONNECT_PROJECT_ID: z.string(),
  /**
   * Web app version as git commit hash.
   */
  NEXT_PUBLIC_GIT_HASH: z.string(),
});

type ClientEnvSchemaType = z.infer<typeof clientEnvSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ClientEnvSchemaType {}
  }
}

const clientEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_LONGTAIL_WALLETCONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_LONGTAIL_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_GIT_HASH: process.env.NEXT_PUBLIC_GIT_HASH,
});

if (!clientEnv.success) {
  console.error("Invalid client environment variables: ", clientEnv.error.name);
  throw new Error(clientEnv.error.message);
}

export default clientEnv.data;
