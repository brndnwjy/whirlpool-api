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
    return pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  },

  goOnline: (id) => {
    return pool.query(`UPDATE users SET status = 1 WHERE user_id = $1`, [id])
  },

  goOffline: (id) => {
    return pool.query(`UPDATE users SET status = 0 WHERE user_id = $1`, [id])
  },

  getUser: (id) => {
    return pool.query("SELECT * FROM users WHERE user_id <> $1", [id]);
  },

  getUserDetail: (id) => {
    return pool.query(`SELECT * FROM users WHERE user_id = $1`, [id]);
  },

  updateUser: (data) => {
    return pool.query(
      `
    UPDATE users SET 
    fullname = COALESCE($1, fullname),
    username = COALESCE($2, username),
    phone = COALESCE($3, phone),
    bio = COALESCE($4, bio),
    avatar  = COALESCE($5, avatar),
    updated_at = COALESCE($6, updated_at)
    WHERE user_id = $7
    `,
      [
        data.fullname,
        data.username,
        data.phone,
        data.bio,
        data.avatar,
        data.date,
        data.id,
      ]
    );
  },

  deleteUser: (id) => {
    return pool.query(`DELETE FROM users WHERE user_id = $1`, [id]);
  },
};

module.exports = userModel;
