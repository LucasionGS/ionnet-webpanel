import process from "node:process";
import * as dotenv from "@std/dotenv";
import * as staticEnvs from "./static-envs.ts";

export interface Environment {
  DEBUG: string;
  SECRET_KEY: string;
  NODE_ENV: string;
  PORT: string;
  MYSQL_DATABASE: string;
  MYSQL_USERNAME: string;
  MYSQL_PASSWORD: string;
  APPDIR: string;
  SQLITE_FILE: string;

  /**
   * The directory where nginx is installed.
   */
  NGINX_DIR: string;
  /**
   * The directory where nginx configuration files are stored.
   */
  NGINX_AVAILABLE_DIR: string;
  /**
   * The directory where enabled nginx configuration files are stored.  
   * Files are linked from NGINX_AVAILABLE_DIR to this directory.
   */
  NGINX_ENABLED_DIR: string;
  /**
   * Direct path to the nginx configuration file. (nginx.conf)
   */
  NGINX_CONF: string;
  /**
   * The directory where managed configuration files are stored. The names match the configuration file names in NGINX_AVAILABLE_DIR.  
   * Files are only present in this directory if they are managed by the application.
   */
  NGINX_MANAGED: string;
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
export function isDevelopment() {
  return envs.NODE_ENV === "development";
}
export function isProduction() {
  return envs.NODE_ENV === "production";
}
export function isDebug() {
  return envs.DEBUG === "true";
}