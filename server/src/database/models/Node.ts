import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize.ts";

/**
 * A node is the most basic form of data. All content is stored in nodes, from pages
 */
export class Node extends Model {
  declare id: number;
  declare name: string;
  declare parentId?: number;
  declare authorId: number;
  declare private fields: string;
  private _fields: Record<string, unknown>[] = [];
  public get fieldData(): Record<string, unknown>[] {
    return this._fields ??= JSON.parse(this.fields);
  }

  public set fieldData(value: Record<string, unknown>[]) {
    this.fields = JSON.stringify(value);
    this._fields = value;
  }
  
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Node.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  parentId: {
    type: DataTypes.INTEGER,
  },
  fields: {
    type: DataTypes.TEXT,
  },
  authorId: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  modelName: "icms_node"
});