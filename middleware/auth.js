module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    console.log("----");
    res.redirect("/users/login");
  },
};
