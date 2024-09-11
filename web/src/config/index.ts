import clientEnv from "./clientEnv";
import appConfig from "./app";
import wagmiConfig from "./wagmi";
import * as chains from "./chains";
import * as tokens from "./chains";

const config = { ...clientEnv, ...appConfig, wagmiConfig, chains, tokens };
export default config;
