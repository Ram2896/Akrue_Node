const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
require("dotenv").config();
const compression = require("compression");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const waitlistRoutes = require("./routes/waitlist");
const brainTreeRoutes = require("./routes/braintree");
const orderRoutes = require("./routes/order");

//app
const app = express();

//db

const DB = process.env.DATABASE_CLOUD.replace(
  "<PASSWORD>",
  process.env.DATABASE_CLOUD_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,

  })
  .then(() => console.log("database connected"));

// react
app.use(compression());
app.use(express.static(path.join(__dirname, "build"))); //serving static files

// Global Middle wares
app.use(helmet()); //Set security http headers

app.use(morgan("dev")); // Development logging
const limiter = rateLimit({
  max: "10000",
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this ip , Please try again in an hour!",
});

app.use("/api", limiter); // limit require from same api Prevent from brut force number of request from hackers
// body parser reading data from body into req.body
app.use(bodyParser.json());

// Data Sanitization against no sql query injection
app.use(mongoSanitize()); //remove mongoo char $ {}
// Data sanitization agaainst xss
app.use(xss()); //remove html code

// prevent parameter pollution
app.use(
  hpp({
    whitelist: ["name"],
  })
);

app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
// app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", waitlistRoutes);
// app.use("/api", brainTreeRoutes);
// app.use("/api", orderRoutes);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
