const mongoose = require("mongoose");

const waitlistSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 32,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 32,
    },
    university: {
      type: String,
      required: true,
      maxlength: 32,
    },
    graduatingYear: {
      type: String,
      required: true,
      maxlength: 32,
    },
    sport: {
      type: String,
      required: true,
      maxlength: 32,
    },
    gender: {
      type: String,
      required: true,
      maxlength: 32,
    },
    instaUsername: {
      type: String,
      required: true,
      maxlength: 32,
    },
    refererEmail: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Waitlist", waitlistSchema);
