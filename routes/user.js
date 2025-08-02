const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
//controller
const userController = require("../controller/users.js")

//User all route


router.get("/signup",userController.renderSignup)

router.post("/signup",wrapAsync(userController.userSignup))

router.get("/login",userController.renderLogin)

router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login",failureFlash : true,}),userController.login)


router.get("/logout",userController.logout)
module.exports = router;