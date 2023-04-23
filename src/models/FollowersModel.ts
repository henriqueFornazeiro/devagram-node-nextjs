import mongoose, { Schema } from "mongoose";

const FollowersSchema = new Schema({
  userId: { type: String, required: true },
  followedUserId: { type: String, required: true },
});

export const FollowersModel =
  (mongoose.models.followers || mongoose.model("followers", FollowersSchema));
