import clientEnv from "./clientEnv";
import serverEnv from "./serverEnv";
import appConfig from "./app";
import wagmiConfig from "./wagmi";
import * as networks from "./networks";
import * as tokens from "./networks";

const config = { ...clientEnv, ...appConfig, wagmiConfig, networks, tokens };
export { serverEnv };
export default config;
