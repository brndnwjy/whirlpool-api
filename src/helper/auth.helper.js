const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const config = {
    expiresIn: "1h",
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, config);
  return token;
};

module.exports = generateToken;
