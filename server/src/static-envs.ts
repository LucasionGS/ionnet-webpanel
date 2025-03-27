/*
  All exported variables are used and compiled into the executable.
  This is useful for storing non-sensitive information that is used in the application.
  Note: This file is included in the git repository. It is not recommendeddd to store sensitive information here.

  .env files are used for storing sensitive information, and are not included in the git repository.
  Values in .env files are loaded into the application at runtime and will override values in this file.

  Variables used in strings (Non-literal strings) are replaced after loading the .env file.
  This allows for you to change only, for example, the NGINX_DIR variable in the .env file,
  and thhe NGINX_DIR_* that depend on it will use that new value, without having to manually change them all.
*/
import { resolve } from "node:path";
import process from "node:process";

// export const MYSQL_DATABASE = "ionnet";
// export const MYSQL_USERNAME = "root";
// export const MYSQL_PASSWORD = "password";
export const DEBUG = "false";
export const SECRET_KEY = "DEFAULT_SECRET_ENCRYPTION_KEY";
export const APPDIR = resolve(process.env.HOME!, ".ionnet/webpanel");
export const SQLITE_FILE = "${APPDIR}/db.sqlite";
export const NGINX_DIR = "/etc/nginx";
export const NGINX_AVAILABLE_DIR = "${NGINX_DIR}/sites-available";
export const NGINX_ENABLED_DIR = "${NGINX_DIR}/sites-enabled";
export const NGINX_MANAGED = "${APPDIR}/managed";
export const NGINX_CONF = "${NGINX_DIR}/nginx.conf";
export const NGINX_ALLOW_GROUP = "sudo";
export const NGINX_COMMAND_RELOAD = "nginx -s reload";
export const NGINX_COMMAND_RESTART = "nginx -s reopen";