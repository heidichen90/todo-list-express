const express = require("express");
const router = express.Router();

const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../../models/user");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "All fields required." });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "Password didnt match Confirm Password." });
  }
  if (errors.length) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }
  User.findOne({ email }).then((user) => {
    if (user) {
      errors.push({ message: "This email is registered" });
      return res.render("register", {
        errors,
        name,
        email,
        password,
        confirmPassword,
      });
    } else {
      //create a new user
      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hash) => User.create({ name, email, password: hash }))
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => console.log(err));
    }
  });
});

router.get("/logout", (req, res) => {
  //calling logout, passport will automatically clear out the session
  req.logout();
  req.flash("success_msg", "You have successfully logged out");
  res.redirect("/users/login");
});

module.exports = router;
