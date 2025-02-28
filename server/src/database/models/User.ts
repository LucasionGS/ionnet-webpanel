import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize.ts";
import SharedUser from "../../../../shared/SharedUser.ts";

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public toShared() {
    return new SharedUser(this);
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: "users"
});