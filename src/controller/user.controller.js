const { v4: uuid } = require("uuid");
const { hash, compare } = require("bcryptjs");
const createError = require("http-errors");

const userModel = require("../model/user.model");

const userController = {
  // auth
  register: async (req, res, next) => {
    try {
      const id = uuid();
      const { fullname, email, phone, password } = req.body;
      const hashedPassword = await hash(password, 10);
      const date = new Date();

      const data = {
        id,
        fullname,
        email,
        phone,
        password: hashedPassword,
        date,
      };

      await userModel.register(data);

      delete data.password;

      res.json({
        msg: "register berhasil",
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const result = await userModel.checkMail(email);
      const check = result.rowCount;

      if (!check) {
        return next(createError(404, "email/password incorrect"));
      }

      const [user] = result.rows;

      const valid = await compare(password, user.password);

      if (!valid) {
        return next(createError(404, "email/password incorrect"));
      }

      delete user.password;

      const payload = {
        id: user.user_id,
        name: user.fullname,
        email: user.email,
        phone: user.phone,
      };

      res.json({
        msg: "login berhasil",
        data: user,
      });
    } catch (error) {
      console.log(error);
    }
  },

  // crud
  getUser: async (req, res, next) => {
    try {
      const user = await userModel.getUser();
      res.json({
        msg: "get user berhasil",
        data: user.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = userController;
