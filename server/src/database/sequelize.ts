import Environment from "../Environment.ts";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  logging: false,
  // dialect: "mysql",
  dialect: "sqlite",
  storage: Environment.SQLITE_FILE,
  // database: Environment.MYSQL_DATABASE,
  // username: Environment.MYSQL_USERNAME,
  // password: Environment.MYSQL_PASSWORD,
});