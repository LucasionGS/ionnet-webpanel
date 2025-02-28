/*
  All exported variables are used and compiled into the executable.
  This is useful for storing non-sensitive information that is used in the application.
  Note: This file is included in the git repository. It is not recommendeddd to store sensitive information here.

  .env files are used for storing sensitive information, and are not included in the git repository.
  Values in .env files are loaded into the application at runtime and will override values in this file.
*/
import { resolve } from "node:path";
import process from "node:process";

// export const MYSQL_DATABASE = "ionnet";
// export const MYSQL_USERNAME = "root";
// export const MYSQL_PASSWORD = "password";
export const APPDIR = resolve(process.env.HOME!, ".ionnet/webpanel");
export const SQLITE_FILE = `${APPDIR}/db.sqlite`;
export const NGINX_DIR = "/etc/nginx";
export const NGINX_AVAILABLE_DIR = `${NGINX_DIR}/sites-available`;
export const NGINX_ENABLED_DIR = `${NGINX_DIR}/sites-enabled`;
export const NGINX_CONF = `${NGINX_DIR}/nginx.conf`;