import z from "zod";

const clientEnvSchema = z.object({
  /**
   * Url of the graph server.
   */
  NEXT_PUBLIC_LONGTAIL_GRAPHQL_URL: z.string().url(),
  /**
   * Walletconnect project id.
   */
  NEXT_PUBLIC_LONGTAIL_WALLETCONNECT_PROJECT_ID: z.string(),
});

type ClientEnvSchemaType = z.infer<typeof clientEnvSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ClientEnvSchemaType {}
  }
}

const clientEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_LONGTAIL_GRAPHQL_URL:
    process.env.NEXT_PUBLIC_LONGTAIL_GRAPHQL_URL,
  NEXT_PUBLIC_LONGTAIL_WALLETCONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_LONGTAIL_WALLETCONNECT_PROJECT_ID,
});

if (!clientEnv.success) {
  console.error("Invalid client environment variables: ", clientEnv.error.name);
  throw new Error(clientEnv.error.message);
}

export default clientEnv.data;
