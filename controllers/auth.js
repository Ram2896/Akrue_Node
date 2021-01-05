const { promisify } = require("util");
const User = require("../models/user");
const jwt = require("jsonwebtoken"); //to generate signed tojken
const expressJwt = require("express-jwt"); //for authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");
const sendEmail = require("../helpers/email");

const signToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
};

exports.signup = (req, res) => {
  // console.log("req.body", req.body);
  // const user = new User(req.body);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    user.salt = undefined;
    user.hashed_password = undefined;
    const token = signToken(user.id);
    // const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
    //   expiresIn: process.env.JWT_EXPIRES_IN,
    // });

    res.json({
      token,
      user,
    });
  });
};

exports.signin = (req, res) => {
  // find user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user with that email dose not exixt please Signup",
      });
    }
    // I USEr found make sure the email and password match
    //  create Authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password don't match",
      });
    }
    // Generate a signed token with user id and secret
    const token = signToken(user.id);
    // console.log("cooktoken", token);
    // persist the token as 't' in cookie with expiry  date
    res.cookie("t", token, cookieOptions);
    // return response with user and token to frontend client
    const { _id, name, email, role } = user;

    sendEmail({
      email: user.email,
      subject: "siginin message...",
      message: `hi ${user.email}... Welcome to our cake shop.You have successfully logged in to our cakeshop`,
    });

    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({
    message: "Signout success fully",
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  // let token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // }
  // if (!token) {
  //   return res.status(401).json({
  //     error: "You are not logged In. Please log in to get access",
  //   });
  // }

  // const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // console.log("decoded", decoded);

  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin Resourse! Access denied",
    });
  }
  next();
};
