import fs from "node:fs";
import fsp from "node:fs/promises";
import Env from "../Environment.ts";
import { promisify } from "node:util";
import { exec } from "node:child_process";

const exists = promisify(fs.exists);

namespace Nginx {
  exists(Env.NGINX_AVAILABLE_DIR).then((exists) => {
    if (exists) {
      fsp.mkdir(Env.NGINX_AVAILABLE_DIR, { recursive: true });
    }
  });

  export function reload() {
    return new Promise((resolve, reject) => {
      exec("nginx -s reload", (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        resolve({ stdout, stderr });
      });
    });
  }

  export function restart() {
    return new Promise((resolve, reject) => {
      exec("nginx -s reopen", (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        resolve({ stdout, stderr });
      });
    });
  }

  export async function getConfigs() {
    const webconfig = await fsp.readdir(Env.NGINX_AVAILABLE_DIR, "utf-8");
    return webconfig;
  }

  export async function getConfig(id: string) {
    if (!await exists(`${Env.NGINX_AVAILABLE_DIR}/${id}`)) {
      throw new Error(`"${id}" does not exist.`);
    }

    return fsp.readFile(`${Env.NGINX_AVAILABLE_DIR}/${id}`, "utf-8");
  }

  export async function getConfigDetails(id: string) {
    const stat = await fsp.stat(`${Env.NGINX_AVAILABLE_DIR}/${id}`);
    const created = stat.birthtime;
    const updated = stat.mtime;
    return { created, updated };
  }
  
  export async function getConfigEnabled(id: string) {
    // if (!await exists(`${Env.NGINX_AVAILABLE_DIR}/${id}`)) {
    //   throw new Error(`"${id}" does not exist.`);
    // }

    return await exists(`${Env.NGINX_ENABLED_DIR}/${id}`);
  }

  export async function enableConfig(id: string) {
    const enabled = await Nginx.getConfigEnabled(id);
    if (!enabled) {
      await fsp.symlink(`${Env.NGINX_AVAILABLE_DIR}/${id}`, `${Env.NGINX_ENABLED_DIR}/${id}`);
    }
  }

  export async function disableConfig(id: string) {
    const enabled = await Nginx.getConfigEnabled(id);
    if (enabled) {
      await fsp.unlink(`${Env.NGINX_ENABLED_DIR}/${id}`);
    }
  }


  // These need testing
  export function insertSnippet(snippetId: string, config: string, line: number, snippet: string) {
    const lines = config.split("\n");
    lines.splice(line, 0,
`  #Ionnet|${snippetId}
  ${snippet}
  #/Ionnet|${snippetId}`
    );
    const newConfig = lines.join("\n");
    return newConfig;
  }

  export function removeSnippet(snippetId: string, config: string) {
    const newConfig = config.replace(/#Ionnet\|(.+?)\n([\w\W]*?)\n\s*#\/Ionnet\|\1/g, (match, id) => {
      if (id === snippetId) {
        return "";
      }
      return match;
    });
    return newConfig;
  }

  export class NginxConfigData {
    constructor(data: NginxConfigData) {
      Object.assign(this, data);
    }

    // Values
    /**
     * The server domain this server is available on. This must be the primary domain, and used for the identifiers, files, and folders.
     */
    declare serverName: string;
    /**
     * If the server is accessible on multiple domains, list them here. The serverName should also be included in this list.
     */
    declare serverNames?: string[];
    /**
     * The port to listen on.
     * @default 80
     */
    declare listen?: number;
    /**
     * Whether to use SSL.
     * @default false
     */
    declare ssl?: boolean;
    /**
     * The PHP version to use, e.g `8.3`. Default is no php.
     */
    declare phpVersion?: number | string;
    /**
     * The index file to use.
     * @default "index.html" or "index.php" (if PHP is enabled)
     * @example "index.html"
     */
    declare index?: string;

    /**
     * Server redirect configuration. These settings are specific to the `server_redirect` block.
     */
    declare $server_redirect?: {
      redirectUrl?: string;
      redirectCode?: number;
    }
  }

  export interface INginxConfigData extends NginxConfigData {}

  export interface INginxConfigBlock {
    name: string;
    content: string | string[] | ((data: NginxConfigData) => string | string[]);
  }

  export class NginxConfigBlock {
    public name: string;
    public content: INginxConfigBlock["content"];
    constructor(block: INginxConfigBlock) {
      this.name = block.name;
      this.content = block.content;
    }

    /**
     * Returns the content of the block as a string. If the content is a function, it will be called.
     */
    public parse(data: INginxConfigData) {
      const content = typeof this.content == "function" ? this.content(
        data instanceof NginxConfigData
          ? data
          : new NginxConfigData(data)
        ) : this.content;

      if (Array.isArray(content)) {
        return content.join("\n");
      }

      return content;
    }
  }

  export class NginxConfigPlaceholder {
    public id: string;
    constructor(id: string) {
      this.id = id;
    }
  }
  
  export function build(configData: NginxConfigData) {
    // const blocks = configBlocks.map((block) => new NginxConfigBlock(block));
    const config = new NginxConfigBlock(Nginx.blocks.server).parse(configData);
    return config;
  }

  export const blocks: Record<string, INginxConfigBlock> = {
    server: {
      name: "server",
      content: (data) => {
        const index = data.index ?? (data.phpVersion ? "index.php" : "index.html");
        return config`${data}
server {

  server_name ${data.serverNames ? data.serverNames.join(" ") : data.serverName};

  root /var/www/vhosts/${data.serverName}/public;

  add_header X-Frame-Options "SAMEORIGIN";
  add_header X-Content-Type-Options "nosniff";

  index ${index};

  charset utf-8;

  ${new NginxConfigPlaceholder("logging")}

  fastcgi_intercept_errors on;
 
  location / {
    try_files $uri $uri/ /${index}?$query_string;
  }

  location ~ /\.(?!well-known).* {
    deny all;
  }

  error_page 404 /${index};

  ${new NginxConfigPlaceholder("phpFpm")}

  ${new NginxConfigPlaceholder("listen")}
}`
    }},
    server_redirect: {
      name: "server_redirect",
      content: data => config`${data}
server {
  ${new NginxConfigPlaceholder("listen")}
  server_name ${data.serverNames ? data.serverNames.join(" ") : data.serverName};
  return ${data.$server_redirect?.redirectCode ?? 301} ${data.$server_redirect?.redirectUrl ?? "https://$server_name$request_uri"};
}`
    },
    logging: {
      name: "test",
      content: data => config`${data}
  error_log /var/www/log/${data.serverName}/error_log error;
  access_log /var/www/log/${data.serverName}/access_log;`
    },
    phpFpm: {
      name: "phpFpm",
      content: data => data.phpVersion ? config`${data}
  location ~ \.php$ {
    fastcgi_pass unix:/run/php/php${data.phpVersion}-fpm.sock;
    fastcgi_split_path_info ^((?U).+\.php)(/?.+)$;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_param PATH_INFO $fastcgi_path_info;
    fastcgi_param PATH_TRANSLATED $document_root$fastcgi_path_info;
    fastcgi_read_timeout 600s;
    fastcgi_send_timeout 600s;
    fastcgi_index index.php;
    include /etc/nginx/fastcgi_params;
    fastcgi_hide_header X-Powered-By;
  }` : ""
    },

    listen: {
      name: "listen",
      content: data => config`${data}
  listen ${(data.listen ?? 80)}${data.ssl ? " ssl" : ""};
  ${data.ssl ? `ssl_certificate /etc/letsencrypt/live/${data.serverName}/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/${data.serverName}/privkey.pem;
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;` : ""}`
    }
  }

  /**
   * Template tag for building nginx configuration files.  
   * Supports placeholders for blocks using the `NginxConfigPlaceholder` class. Other values will be inserted as-is.
   */
  export function config(strings: TemplateStringsArray, ...values: unknown[]) {
    // Expect first value to be the data object
    const stringParts = [...strings.values()];
    let data: NginxConfigData;
      if (values[0] instanceof NginxConfigData) {
      data = values.shift() as NginxConfigData;
      stringParts.shift(); // Remove the first empty string
    }
    console.log(stringParts, values);
    
    let str = "";
    stringParts.forEach((string, i) => {
      const value = values[i];
      if (value instanceof NginxConfigPlaceholder) {
        if (!data) {
          throw new Error(
            "Data object is required when using placeholders. Make sure to pass the data object as the first argument:\n"
            + "config`${data}...`"
          );
        }
        str += string;
        const space = (str.match(/\n\s*$/)?.[0] ?? "\n").slice(1);
        str += `#Ionnet|${value.id}\n${space}${new NginxConfigBlock(blocks[value.id]).parse(data).trim()}${space}#/Ionnet|${value.id}`;
      }
      else {
        str += string + (value ?? "");
      }
    });
    return str;
  }
}

export default Nginx;