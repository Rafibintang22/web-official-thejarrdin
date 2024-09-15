const jwt = require("jsonwebtoken");

class Authorization {
  static async encryption(payload) {
    try {
      const secretKey = process.env.SECRET_KEY;

      const options = {
        expiresIn: "12h",
      };

      const token = jwt.sign(payload, secretKey, options);

      return token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async decryption(req, res, next) {
    try {
      const token = req.headers["authorization"];

      if (!token) {
        return res.status(401).json({ message: "Unauthorized", header: req.headers });
      }

      const secretKey = process.env.SECRET_KEY;

      const decoded = jwt.verify(token, secretKey);

      req.dataSession = decoded;

      next();
    } catch (error) {
      console.error(error);

      if (error.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Token has expired" });
      }

      return res.status(403).json({ message: "Forbidden" });
    }
  }
}

module.exports = { Authorization };
