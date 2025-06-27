import mongoose , {Schema} from "mongoose";

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
      required: [true,'Password Required']
    },

    refreshToken:{
      type: String,
    }

  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);

export default user;
