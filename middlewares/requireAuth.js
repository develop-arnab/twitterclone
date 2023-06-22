var jwt = require("jsonwebtoken");
const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}";
const JWT_REFRESH_SECRET = "{asdfasdfdsfa-B794-4A04-89DD-15FE7FDBFF78}";
const requireAuth = async (req, res, next) => {
  const { tweet } = req.body;
  // const token = req.cookies.JWT_TOKEN;
  var token = req.headers.authorization;
  token = token.split(" ")[1];
//   console.log("SERVER COOKIE ", token);
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("Verify Error ", err);
          res.send("Could not authenticate user");
        } else {
          console.log("DECODED ", decoded);
          next();
        }
      });
    } catch (ex) {
      // return null;
    }
  } else {
    return res.send("Not Authentication.");
  }
};

module.exports = { requireAuth };
