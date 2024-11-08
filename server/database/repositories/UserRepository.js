const { UserModel, RoleModel, UserRoleModel } = require("../models");

class UserRepository {
  static async readAll() {
    try {
      const findUser = await UserModel.findAll({
        include: {
          model: UserRoleModel,
          required: true,
          include: { model: RoleModel, required: true },
        },
      });

      const transformedData = findUser.map((user) => ({
        UserID: user.userID,
        Nama: user.nama,
        Email: user.email,
        NoTelp: user.noTelp,
        Role: user.user_roles.map((role) => ({
          Nama: role.Role.nama,
          RoleID: role.Role.roleID,
        })),
      }));

      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  static async readOne(userID) {
    try {
      const findUser = await UserModel.findOne({
        where: { userID: userID },
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
      const findUser = await UserModel.findOne({
        where: identifier.includes("@") ? { email: identifier } : { noTelp: identifier },
        include: [
          {
            model: UserRoleModel,
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

      // console.log(findUser);
      // Transform the data
      const formattedData = {
        UserID: findUser.userID,
        NoTelp: findUser.noTelp,
        Nama: findUser.nama,
        Email: findUser.email,
        Role: findUser.user_roles.map((userRole) => ({
          Nama: userRole.Role.nama,
          Deskripsi: userRole.Role.deskripsi,
        })),
      };

      return formattedData;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { UserRepository };
