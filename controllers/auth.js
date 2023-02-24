const User = require("../models/user");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    const dup_email = await User.findOne({ email: email });
    const dup_name = await User.findOne({ name: name });

    if (dup_email) {
      res.status(400).send({ msg: "user is already registerd" });
    } else if (dup_name) {
      res.status(400).send({ msg: "user name is not available" });
    } else {
      if (name && password) {
        const user = await User.create(req.body);

        const token = user.createToken();

        res.cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 600000),
        });

        res.status(200).json({ msg: "registerd successfully", user });
      } else {
        res.status(400).send({ msg: "please provide credentials " });
      }
    }
  } catch (error) {
    // checking validation
    if (error.name === "ValidationError") {
      console.log(error.errors);
      const message = Object.values(error.errors).map((value) => value.message);
      return res.status(500).json({
        error: message,
      });
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      return res.status(400).send({ msg: "Please provide password" });
    }

    const user = await User.findOne({ email: email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send({ msg: "Please enter correct password" });
      } else {
        const token = user.createToken();
        // here you have to send cookie to the frontend

        res.cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 600000),
        });
        res.status(200).send({ user: { name: user.name, token: token } });
      }
    } else {
      return res
        .status(400)
        .send({ msg: "user does not exists please register " });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((value) => value.message);
      return res.status(400).json({
        error: message,
      });
    }
  }
};

const logout = async (req, res) => {
  res.status(200).send("logout");
};

module.exports = { login, register, logout };
