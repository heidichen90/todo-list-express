const express = require("express");
const router = express.Router();

const home = require("./modules/home");
const todos = require("./modules/todos");
const users = require("./modules/users");
const auth = require("./modules/auth");

//登入之後才可以用的再放這一層
const { authenticator } = require("../middleware/auth");

//router由上到下去比對，條件寬鬆的往後放
router.use("/todos", authenticator, todos);
router.use("/auth", auth);
router.use("/users", users);
router.use("/", authenticator, home);

module.exports = router;
