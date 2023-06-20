"use strict";
const User = require("../models/user");
const Tweet = require("../models/Tweet");
const request = require("request");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Following = require("../models/Following");
//bad idea
const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}";
const JWT_REFRESH_SECRET = "{asdfasdfdsfa-B794-4A04-89DD-15FE7FDBFF78}";
const SERVER_PREFIX = "/server";

require("../database")();

const registerUser = async (req, res, next) => {
  const { username, password: plainTextPassword } = req.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters"
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      username,
      password
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }

  res.json({ status: "ok" });
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean();

    if (!user) {
      return res.json({ status: "error", error: "Invalid username/password" });
    }
    const saltedPassword = user.password;
    const successResult = await bcrypt.compare(password, saltedPassword);

    //logged in successfully generate session
    if (successResult === true) {
      //sign my jwt
      const payLoad = {
        name: username,
        role: "User"
      };
      const token = jwt.sign(payLoad, JWT_SECRET, {
        algorithm: "HS256"
        // expiresIn: "30"
      });
      const refreshtoken = jwt.sign(payLoad, JWT_REFRESH_SECRET, {
        algorithm: "HS256"
      });

      //save the refresh token in the database
      User.updateOne(
        { username: username },
        { $set: { refreshToken: refreshtoken } },
        { strict: false },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated Docs : ", docs);
          }
        }
      );
      res.setHeader("set-cookie", [
        `JWT_TOKEN=${token}; httponly; samesite=lax`
      ]);
      res.send({
        status: "Success",
        refreshToken: token
      });
    } else {
      res.send({ error: "Incorrect username or password" });
    }
  } catch (ex) {
    console.error(ex);
  }
};

const refreshToken = async (req, res) => {
  const token = req.body.refreshToken;
  const user = await validateToken(token, JWT_REFRESH_SECRET);

  if (user === null) {
    res.sendStatus(403);
    return;
  }
  const result = await User.findOne({ refreshToken: token }).lean();

  if (!result) {
    res.sendStatus(403);
  } else {
    const payLoad = { name: user.name, role: user.role };
    const token = jwt.sign(payLoad, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "30s"
    });
    res.setHeader("set-cookie", [`JWT_TOKEN=${token}; httponly; samesite=lax`]);
    res.send({
      message: "Refreshed successfully in successfully"
    });
  }
};

const logoutUser = async (req, res) => {
  //logging out
  const token = req.body.refreshToken;
  if (token) {
    res.send({
      message: "Logout User"
    });
  }
};

const homeFeeds = async (req, res) => {
  const token = req.cookies.JWT_TOKEN;
  if (token) {
    const user = await validateToken(token, JWT_SECRET);
    if (user === null) {
      res.send({
        message: "Invalid Token"
      });
    } else {
      res.send({
        message: "Well Hello There"
      });
    }
  } //else ask the user to login
  else {
    res.send({
      message: "Invalid"
    });
  }
};
const userTweets = async (req, res) => {
  const { tweet } = req.body;
  // const token = req.cookies.JWT_TOKEN;
  var token = req.headers.authorization;
  token = token.split(" ")[1]
  console.log("SERVER COOKIE ",token)
  if (token) {
    const user = await validateToken(token, JWT_SECRET);
    if (user === null) {
      res.send({
        message: "Invalid Token"
      });
    } else {
      try {
        console.log("user ", user);
        const response = await Tweet.create({
          tweet,
          author: user.name
        });
        console.log("Tweet created successfully: ", response);
        res.send({
          message: "You tweeted "
        });
      } catch (error) {
        if (error.code === 11000) {
          // duplicate key
          return res.json({
            status: "error",
            error: "Username already in use"
          });
        }
        throw error;
      }
      // res.send({
      //   message: "Well Hello There"
      // });
    }
  } //else ask the user to login
  else {
    res.send({
      message: "Invalid"
    });
  }
};
const followUser = async (req, res) => {
  const { follwed_user } = req.body;
  const token = req.cookies.JWT_TOKEN;
  if (token) {
    const user = await validateToken(token, JWT_SECRET);
    if (user === null) {
      res.send({
        message: "Invalid Token"
      });
    } else {
      try {
        console.log("user ", user);
        const response = await Following.findOneAndUpdate(
          {
            username: user.name 
          },{ $push: { following: follwed_user } },
          { upsert: true }
        );
        console.log("Followed: ", response);
        res.send({
          message: "You Followed "
        });
      } catch (error) {
        if (error.code === 11000) {
          // duplicate key
          return res.json({
            status: "error",
            error: "Username already in use"
          });
        }
        throw error;
      }
      // res.send({
      //   message: "Well Hello There"
      // });
    }
  } //else ask the user to login
  else {
    res.send({
      message: "Invalid"
    });
  }
};
async function validateToken(token, secret) {
  try {
    const result = jwt.verify(token, secret);

    return {
      name: result.name,
      role: result.role
    };
  } catch (ex) {
    return null;
  }
}
module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  homeFeeds,
  userTweets,
  followUser
};
