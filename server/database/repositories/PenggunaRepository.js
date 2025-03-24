const { PenggunaModel, RoleModel, PenggunaRoleModel } = require("../models");
const { DatabaseManager } = require("../../config/DatabaseManager");
const jarrdinDB = DatabaseManager.getDatabase(process.env.DB_NAME);

class PenggunaRepository {
    static async readAll() {
        try {
            const findUser = await PenggunaModel.findAll({
                where: {
                    status: [0, 1], // Hanya ambil pengguna dengan status 0 atau 1
                },
                include: {
                    model: PenggunaRoleModel,
                    required: true,
                    include: { model: RoleModel, required: true },
                },
            });

            const transformedData = findUser.map((user) => ({
                UserID: user.pengguna_id,
                Nama: user.nama,
                Email: user.email,
                NoTelp: user.no_telp,
                Role: user.pengguna_roles.map((role) => ({
                    Nama: role.Role.nama,
                    RoleID: role.Role.role_id,
                })),
                Status:
                    user.status === 0
                        ? "Requested"
                        : user.status === 1
                        ? "Active"
                        : user.status === 2
                        ? "Unactive"
                        : "Udentified",
            }));

            return transformedData;
        } catch (error) {
            throw error;
        }
    }

    static async readAllUserByRole(role_id) {
        try {
            const users = await PenggunaModel.findAll({
                where: {
                    status: [0, 1], // Hanya ambil pengguna dengan status 0 atau 1
                },
                include: [
                    {
                        model: PenggunaRoleModel,
                        required: true,
                        where: { role_id: role_id }, // Filter by role_id
                        include: [
                            {
                                model: RoleModel,
                                required: true,
                            },
                        ],
                    },
                ],
            });

            // Transform the data into a simplified format
            const transformedData = users.map((user) => ({
                UserID: user.pengguna_id,
                Nama: user.nama,
                Email: user.email,
                NoTelp: user.no_telp,
                Role: user.pengguna_roles.map((penggunaRole) => ({
                    Nama: penggunaRole.Role.nama,
                    RoleID: penggunaRole.Role.role_id,
                })),
            }));

            return transformedData;
        } catch (error) {
            throw error;
        }
    }

    static async readOne(pengguna_id) {
        try {
            const findUser = await PenggunaModel.findOne({
                include: {
                    model: PenggunaRoleModel,
                    required: true,
                    include: { model: RoleModel, required: true },
                },
                where: { pengguna_id: pengguna_id },
            });

            if (!findUser) {
                const newError = new Error("User tidak ditemukan.");
                newError.status = 404;
                throw newError;
            }

            const transformedData = {
                UserID: findUser.pengguna_id,
                Nama: findUser.nama,
                Email: findUser.email,
                NoTelp: findUser.no_telp,
                Alamat: findUser.alamat,
                NoUnit: findUser.no_unit,
                Role: findUser.pengguna_roles.map((role) => ({
                    Nama: role.Role.nama,
                    RoleID: role.Role.role_id,
                })),
            };

            return transformedData;
        } catch (error) {
            throw error;
        }
    }

    static async readExisting(identifier) {
        try {
            const findUser = await PenggunaModel.findOne({
                where: identifier.includes("@") ? { email: identifier } : { no_telp: identifier },
                include: [
                    {
                        model: PenggunaRoleModel,
                        required: true,
                        include: [
                            {
                                model: RoleModel,
                                required: true,
                            },
                        ],
                    },
                ],
                raw: false, // Untuk mempertahankan struktur objek terkait
            });

            if (!findUser) {
                const newError = new Error("Email atau No telepon tidak terdaftar");
                newError.status = 404;
                throw newError;
            }

            // console.log(findUser);
            // Transform the data
            const formattedData = {
                UserID: findUser.pengguna_id,
                NoTelp: findUser.no_telp,
                Nama: findUser.nama,
                Email: findUser.email,
                Role: findUser.pengguna_roles.map((penggunaRole) => ({
                    Nama: penggunaRole.Role.nama,
                    Deskripsi: penggunaRole.Role.deskripsi,
                })),
            };

            return formattedData;
        } catch (error) {
            throw error;
        }
    }

    static async update(dataUpdate) {
        const transaction = await jarrdinDB.transaction();
        try {
            const findUser = await PenggunaModel.findOne({
                where: { pengguna_id: dataUpdate.UserID },
            });

            if (!findUser) {
                const newError = new Error("Pengguna tidak ditemukan");
                newError.status = 404;
                throw newError;
            }

            await findUser.update(
                {
                    nama: dataUpdate.Nama,
                    email: dataUpdate.Email,
                    no_telp: dataUpdate.NoTelp,
                    alamat: dataUpdate.Alamat,
                    no_unit: dataUpdate.NoUnit,
                },
                { transaction }
            );

            if (dataUpdate.Role) {
                for (const role of dataUpdate.Role) {
                    const findRole = await RoleModel.findOne({
                        where: { role_id: role.RoleID },
                    });

                    if (!findRole) {
                        const error = new Error("Role not found.");
                        error.status = 404;
                        throw error;
                    }

                    switch (role.Action) {
                        case "CREATE":
                            await PenggunaRoleModel.create(
                                {
                                    pengguna_id: findUser.pengguna_id,
                                    role_id: role.RoleID,
                                },
                                { transaction }
                            );
                            break;
                        case "DELETE":
                            await PenggunaRoleModel.destroy({
                                where: {
                                    pengguna_id: findUser.pengguna_id,
                                    role_id: role.RoleID,
                                },
                                transaction,
                            });
                            break;
                        default:
                            1;
                            const newError = new Error("Invalid request format.");
                            newError.status = 400;
                            throw newError;
                    }
                }
            }

            await transaction.commit();

            return findUser;
        } catch (error) {
            await transaction.rollback();
            console.error("Error update Pengguna:", error);
            throw error;
        }
    }

    static async delete(UserID) {
        console.log(UserID);
        const transaction = await jarrdinDB.transaction();
        try {
            const findUser = await PenggunaModel.findOne({
                where: { pengguna_id: UserID },
            });

            if (!findUser) {
                const newError = new Error("Pengguna tidak ditemukan");
                newError.status = 404;
                throw newError;
            }

            await findUser.update(
                {
                    status: 2,
                },
                { transaction }
            );

            await transaction.commit();

            return findUser;
        } catch (error) {
            await transaction.rollback();
            console.error("Error non-aktifkan Pengguna:", error);
            throw error;
        }
    }
}

module.exports = { PenggunaRepository };
