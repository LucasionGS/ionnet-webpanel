import jwt from "jsonwebtoken";
import Envs from "../Environment.ts";
import SharedUser from "../../../shared/SharedUser.ts";

export default class User extends SharedUser {
  public static async getByUsername(username: string): Promise<User | null> {
    const passwd = await Deno.readTextFile("/etc/passwd");
    const lines = passwd.split("\n");
    for (const line of lines) {
      const parts = line.split(":");
      if (parts[0] === username) {
        return new User(parseInt(parts[2]), parts[0]);
      }
    }

    return null;
  }

  public getGroups(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const cmd = new Deno.Command("groups", {args: [this.username]});
      cmd.output().then((output) => {
        if (output.code === 0) {
          const groups = new TextDecoder().decode(output.stdout).trim().split(" ");
          resolve(groups.slice(1).filter(a => a != ":")); // Remove the username from the groups
        } else {
          reject(new Error("Failed to get groups"));
        }
      });
    });
  }

  public jwt() {
    return jwt.sign({ id: this.id, username: this.username }, Envs.SECRET_KEY)
  }

  public static fromJwt(token: string): User | null {
    try {
      const decoded = jwt.verify(token, Envs.SECRET_KEY) as { id: number, username: string };
      return new User(decoded.id, decoded.username);
    }
    catch (_) {
      return null;
    }
  }
}