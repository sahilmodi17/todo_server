const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).send({ msg: "authentication invalid" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;
