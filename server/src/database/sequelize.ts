import Environment from "../Environment.ts";
import { DataTypes, Sequelize } from "sequelize";
import { Node } from "./models/Node.ts";

export const sequelize = new Sequelize({
  logging: false,
  dialect: "mysql",
  database: Environment.MYSQL_DATABASE,
  username: Environment.MYSQL_USERNAME,
  password: Environment.MYSQL_PASSWORD,
});