const { v4: uuid } = require("uuid");
const { hash, compare } = require("bcryptjs");
const createError = require("http-errors");

const userModel = require("../model/user.model");
const generateToken = require("../helper/auth.helper");
const response = require("../helper/response.helper");

const userController = {
  // auth
  register: async (req, res, next) => {
    try {
      const { fullname, email, phone, password } = req.body;

      const { rowCount: check } = await userModel.checkMail(email);

      if (check) {
        return next(createError(404, "email already registerd"));
      }

      const id = uuid();
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

      response(res, data, 200, "register berhasil");
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

      user.token = generateToken(payload);

      response(res, user, 200, "login berhasil");
    } catch (error) {
      console.log(error);
    }
  },

  // crud
  getUser: async (req, res, next) => {
    try {
      const {id} = req.decoded;
      console.log(id)
      const user = await userModel.getUser(id);

      response(res, user.rows, 200, "get user berhasil");
    } catch (error) {
      console.log(error);
    }
  },

  getUserDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        rows: [user],
      } = await userModel.getUserDetail(id);

      response(res, user, 200, "get user detail berhasil");
    } catch (error) {
      console.log(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { fullname, username, phone, bio } = req.body;
      const date = new Date();
      let avatar = null;

      if (req.file) {
        avatar = `http://${req.get("host")}/ava/${req.file.filename}`;
      }

      const data = {
        id,
        fullname,
        username,
        phone,
        bio,
        avatar,
        date,
      };

      console.log(data);

      await userModel.updateUser(data);

      const user = await userModel.getUserDetail(id);

      response(res, user, 200, "update user berhasil");
    } catch (error) {
      console.log(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        rows: [user],
      } = await userModel.getUserDetail(id);
      delete user.password;

      await userModel.deleteUser(id);

      response(res, user, 200, "delete user berhasil");
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = userController;
