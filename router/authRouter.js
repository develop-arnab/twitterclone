"use strict";
const express = require("express");
const {
  registerUser, loginUser, refreshToken,logoutUser, homeFeeds, userTweets, followUser
} = require("../controller/authController");
const router = express.Router();
const {requireAuth} = require('../middlewares/requireAuth')
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/token", refreshToken);
router.post("/logout", logoutUser);
router.get("/home", homeFeeds);

router.post("/tweet", requireAuth , userTweets);

router.post("/follow", requireAuth, followUser);

module.exports = {
    routes: router,
  };
  