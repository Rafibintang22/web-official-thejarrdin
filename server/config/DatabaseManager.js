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

            // Tambahkan data admin setelah sinkronisasi
            const { PenggunaModel } = require("../database/models/PenggunaModel");

            const adminExists = await PenggunaModel.findOne({ where: { kode_user: "ADMIN" } });

            if (!adminExists) {
                const userAdmin = await PenggunaModel.create({
                    kode_user: "ADMIN",
                    nama: "Administrator",
                    no_unit: "000",
                    alamat: "Office",
                    no_telp: null,
                    email: "rafibintang26.rb@gmail.com",
                    status: 1,
                });

                //tambahkan role admin ke tabel pengguna_role
                const { PenggunaRoleModel } = require("../database/models/PenggunaRoleModel");
                await PenggunaRoleModel.create({
                    pengguna_id: userAdmin.pengguna_id,
                    role_id: 5,
                });
                console.log(">> Admin user created successfully.");
            } else {
                console.log(">> Admin user already exists.");
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

    static async seedData(dbName, seeders) {
        const db = DatabaseManager.DATABASES[dbName];

        if (!db) {
            console.error(`>> ${dbName} database is not configured.`);
            return;
        }

        if (!Array.isArray(seeders)) {
            console.error(">> Seeders must be an array of functions.");
            return;
        }

        try {
            console.log(`>> Starting data seeding for ${dbName}...`);
            for (const seeder of seeders) {
                await seeder();
            }
            console.log(`>> Seeding data for ${dbName} completed successfully.`);
        } catch (error) {
            console.error(`>> Error during data seeding for ${dbName}:`, error);
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
