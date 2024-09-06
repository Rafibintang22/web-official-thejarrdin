const { Sequelize, DataTypes, Op, QueryTypes } = require("sequelize");

class DatabaseManager {
  static DATABASES = {};

  constructor(dbName, username, password, hostname, port, dialect) {
    this.db = new Sequelize(dbName, username, password, {
      host: hostname,
      dialect: dialect,
      port: port,
      logging: false,
    });
    DatabaseManager.DATABASES[dbName] = this.db;
  }

  static getDatabase(dbName) {
    return DatabaseManager.DATABASES[dbName];
  }

  static getDatabaseDetail(dbName) {
    const db = DatabaseManager.DATABASES[dbName];

    if (db) {
      return db.config;
    } else {
      console.error(`>> ${dbName} database is not configured.`);
      return null;
    }
  }

  static async authenticate(dbName) {
    const db = DatabaseManager.DATABASES[dbName];

    if (!db) {
      console.error(`>> ${dbName} database is not configured.`);
      return;
    }

    try {
      await db.authenticate();
      console.log(`>> ${dbName} database connected successfully.`);
    } catch (error) {
      console.error(`>> Error connecting to ${dbName} database:`, error);
    }
  }

  static async synchronize(dbName, isForce) {
    const db = DatabaseManager.DATABASES[dbName];

    if (!db) {
      console.error(`>> ${dbName} database is not configured.`);
      return;
    }

    if (!isForce || isForce !== true) {
      isForce = false;
    }

    try {
      if (isForce === true) {
        await db.query("SET FOREIGN_KEY_CHECKS = 0");
      }

      await db.sync({
        force: isForce,
      });

      console.log(`>> ${dbName} database synchronized successfully.`);

      if (isForce === true) {
        await db.query("SET FOREIGN_KEY_CHECKS = 1");
      }
    } catch (error) {
      console.error(`>> Error synchronizing ${dbName} database:`, error);
    }
  }

  static async closeConnection(dbName) {
    const db = DatabaseManager.DATABASES[dbName];

    if (!db) {
      console.error(`>> ${dbName} database is not configured.`);
      return;
    }

    try {
      await db.close();
      console.log(`>> Connection to ${dbName} database closed.`);
    } catch (error) {
      console.error(`Error closing connection to ${dbName} database:`, error);
    }
  }
}

module.exports = {
  DatabaseManager,
  Sequelize,
  DataTypes,
  Op,
  QueryTypes,
};
