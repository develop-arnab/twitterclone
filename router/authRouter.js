"use strict";
const express = require("express");
const {
  registerUser, loginUser, refreshToken,logoutUser, homeFeeds, userTweets, followUser
} = require("../controller/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/token", refreshToken);
router.post("/logout", logoutUser);
router.get("/home", homeFeeds);

router.post("/tweet", userTweets);

router.post("/follow", followUser);

module.exports = {
    routes: router,
  };
  