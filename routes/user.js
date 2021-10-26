const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuth = require("../middleware/isAuth");

//@role: test
//@url: http://localhost:5000/api/auth/test
// private/public
router.get("/test", (req, res) => {
  res.send("hello from the test");
});

//@role: register/signUp
//@url: http://localhost:5000/api/auth/register
// public
router.post("/register", async (req, res) => {
  //step1: add a new user to the dababase
  //recupérer les data  de l'utilisateur
  const { name, lastname, email, password } = req.body;
  try {
    // check for the exiting user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: " this user already exists..." });
    }

    //create a hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create the new user
    user = new User({ name, lastname, email, password: hashedPassword });
    //save the new user
    await user.save();

    //step2: sign the user (login)
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_PASS);
    console.log(process.env.TOKEN_PASS);

    //respond
    res.status(200).json({ msg: "user signed up ", user, token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//@role: login/signin
//@url: http://localhost:5000/api/auth/login
// public
router.post("/login", async (req, res) => {
  //recupérer les data  de l'utilisateur
  const { email, password } = req.body;
  try {
    // check for the exiting user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: " this user doesn't exists..." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ msg: "bad credantials password..." });
    }

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_PASS, {
      expiresIn: "7 days",
    });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});
//@role: getting the authentificated user
//@url: http://localhost:5000/api/auth/user
// private
router.get("/user", isAuth, async (req, res) => {
  try {
    res.status(200).send({ user: req.user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});
//@role: getting the authentificated user
//@url: http://localhost:5000/api/auth/users
// private
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.send(500).json({ msg: error.message });
  }
});

module.exports = router;
