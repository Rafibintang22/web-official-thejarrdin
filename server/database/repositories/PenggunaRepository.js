const { PenggunaModel, RoleModel, PenggunaRoleModel } = require("../models");

class PenggunaRepository {
  static async readAll() {
    try {
      const findUser = await PenggunaModel.findAll({
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
      }));

      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  static async readAllUserByRole(role_id) {
    try {
      const users = await PenggunaModel.findAll({
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
        where: { pengguna_id: pengguna_id },
      });

      if (!findUser) {
        const newError = new Error("User tidak ditemukan.");
        newError.status = 404;
        throw newError;
      }

      return findUser;
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
}

module.exports = { PenggunaRepository };
