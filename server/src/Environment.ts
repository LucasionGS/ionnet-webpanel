import process from "node:process";
import * as dotenv from "@std/dotenv";

export interface Environment {
  NODE_ENV: string;
  PORT: string;
  MYSQL_DATABASE: string;
  MYSQL_USERNAME: string;
  MYSQL_PASSWORD: string;
}

const envs = <Environment>{};
Object.assign(envs, process.env, dotenv.loadSync());

export default envs;