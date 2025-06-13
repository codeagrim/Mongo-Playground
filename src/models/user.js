import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },

    last_name: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);

export default user;
