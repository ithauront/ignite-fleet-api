import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },
    pictureUrl: { type: String, required: true },
    email:      { type: String, required: true, unique: true, index: true },
    googleId:   { type: String, required: true, unique: true, index: true }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);
