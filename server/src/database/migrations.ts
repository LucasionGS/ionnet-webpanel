import { DataTypes, type QueryInterface, type Sequelize } from "sequelize";

export interface Migration {
  name: string;
  /**
   * Timestamp of the migration. This should be a number that is unique to the migration, and newer migrations should have a higher number.
   */
  stamp: number;
  up: (int: QueryInterface, sequelize: Sequelize) => Promise<void>;
  down: (int: QueryInterface, sequelize: Sequelize) => Promise<void>;
}

export default class Migrations {
  private static migrations: Migration[] = [];
  private static ensureMigrationsTable(sequelize: Sequelize) {
    const int = sequelize.getQueryInterface();
    return int.createTable("migrations", {
      name: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      stamp: {
        type: DataTypes.INTEGER,
        primaryKey: true
      }
    });
  }

  /**
   * Add a new migration to the list.
   * @param migration The migration to add to the list of migrations.
   */
  public static addMigration(migration: Migration) {
    Migrations.migrations.push(migration);
  }

  public static async runMigrations(sequelize: Sequelize) {
    await Migrations.ensureMigrationsTable(sequelize);
    const migrations = [...Migrations.migrations].sort((a, b) => a.stamp - b.stamp);
    for (const migration of migrations) {
      const [exists] = await sequelize.query(`SELECT * FROM migrations WHERE name = '${migration.name}' AND stamp = ${migration.stamp}`);
      if (exists.length === 0) {
        const int = sequelize.getQueryInterface();
        await migration.up(int, sequelize);
        await sequelize.query(`INSERT INTO migrations (name, stamp) VALUES ('${migration.name}', ${migration.stamp})`);
      }
    }
  }

  public static async rollbackMigrations(sequelize: Sequelize, stamp?: number) {
    const reverseMigrations = [...Migrations.migrations].sort((a, b) => b.stamp - a.stamp);
    for (const migration of reverseMigrations) {
      const [exists] = await sequelize.query(`SELECT * FROM migrations WHERE name = '${migration.name}' AND stamp = ${migration.stamp}`);
      if (exists.length === 0) { continue; }
      if (migration.stamp > (stamp ?? -1)) {
        const int = sequelize.getQueryInterface();
        await migration.down(int, sequelize);
        await sequelize.query(`DELETE FROM migrations WHERE name = '${migration.name}' AND stamp = ${migration.stamp}`);
      }
      else {
        break;
      }
    }
  }
}


//#region Migrations
Migrations.addMigration({
  name: "create-initial-schema",
  stamp: 1,
  async up(int) {
    await int.createTable("icms_nodes", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING
      },
      parentId: {
        type: DataTypes.INTEGER
      },
      fields: {
        type: DataTypes.TEXT
      },
      authorId: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    });
  },
  async down(int) {
    await int.dropTable("icms_nodes");
  }
});

Migrations.addMigration({
  name: "add-children-to-nodes",
  stamp: 2,
  async up(int) {
    await int.addColumn("icms_nodes", "children", {
      type: DataTypes.TEXT
    });
  },
  async down(int) {
    await int.removeColumn("icms_nodes", "children");
  }
});

Migrations.addMigration({
  name: "add-data",
  stamp: 3,
  async up(int) {
    await int.bulkInsert("icms_nodes", [
      { name: "Home", fields: "[]", authorId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: "About", fields: "[]", authorId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: "Contact", fields: "[]", authorId: 1, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  async down(int) {
    await int.bulkDelete("icms_nodes", {});
  }
});

//#endregion Migrations