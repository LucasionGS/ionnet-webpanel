import process from "node:process";
import * as dotenv from "@std/dotenv";
import * as staticEnvs from "./static-envs.ts";

export interface Environment {
  NODE_ENV: string;
  PORT: string;
  MYSQL_DATABASE: string;
  MYSQL_USERNAME: string;
  MYSQL_PASSWORD: string;
  APPDIR: string;
  SQLITE_FILE: string;

  NGINX_DIR: string;
  NGINX_AVAILABLE_DIR: string;
  NGINX_ENABLED_DIR: string;
  NGINX_CONF: string;
}

const envs = <Environment>{};
Object.assign(envs, process.env, staticEnvs, dotenv.loadSync());

// Handle variables in envs
type K = keyof Environment;
const reg = /\${(\w+)}/;
const checkReplace = (key: string) => {
  const v = envs[<K>key];
  if (reg.test(v)) {
    envs[<K>key] = v.replace(reg, (_, k) => {
      return checkReplace(k);
    });
  }
  return envs[<K>key];
}

for (const key in envs) {
  checkReplace(key);
}

export default envs;