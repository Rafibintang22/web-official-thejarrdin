const { UserModel, UserRoleModel, RoleModel } = require("../models");

class UserRoleRepository {
  static async readRoleByUserID(userID) {
    try {
      const findRole = await UserModel.findOne({
        where: { userID: userID },
        attributes: ["nama", "noTelp"],
        include: [
          {
            model: UserRoleModel,
            required: true,
            include: [
              {
                model: RoleModel,
                required: true,
                attributes: ["nama"],
              },
            ],
          },
        ],
      });

      if (!findRole || !findRole.user_roles) {
        return []; // Mengembalikan array kosong jika tidak ada relasi
      }

      const transformedData = findRole.user_roles.map((role) => ({
        Nama: role.Role.nama,
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching role by user ID: ", error);
      throw error;
    }
  }

  static async readAllPengurusID() {
    try {
      const findUserID = await UserRoleModel.findAll({
        where: { roleID: 1 }, //roleID 1 merupakan id pengurus
        attributes: ["userID"], // mengambil kolom userID saja
        raw: true,
      });

      return findUserID;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { UserRoleRepository };
