const pool = require("../config/db");

const userModel = {
  register: (data) => {
    return pool.query(
      `
        INSERT INTO users (user_id, fullname, email, phone, password, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
      [data.id, data.fullname, data.email, data.phone, data.password, data.date]
    );
  },

  checkMail: (email) => {
    return pool.query(`SELECT * FROM users WHERE email = $1`, [email])
  },

  getUser: () => {
    return pool.query("SELECT * FROM users");
  },
};

module.exports = userModel;
