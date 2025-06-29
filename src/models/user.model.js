import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullname: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    avatar: {
      type: String, // Cloudinary
      required: true,
    },

    coverimage: {
      type: String, //cloudinary
    },

    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    password: {
      type: String,
      required: [true, "Password Required"],
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//Before saving a user in the database, hash their password
//Hookes - Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // skip if not changed

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

// How to make Custom Methods

userSchema.methods.isPasswordCorrect = async function (password) {
  await bcrypt.compare(password, this.password);
};

//  ACCESS_TOKEN
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      //payload

      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },

    process.env.ACCESS_TOKEN_SECRET,

    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// REFRESH_TOKEN
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      //payload

      _id: this._id,
    },

    process.env.REFRESH_TOKEN_SECRET,

    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const user = mongoose.model("User", userSchema);

export default user;
