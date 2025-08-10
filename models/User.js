const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    default: null,
  },
  last_name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default: null,
  },
  token: { 
    type: String,
    default: null
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  collection: 'users' // Explicitly name the collection as 'users'
});

const User = mongoose.model("User", userSchema);

module.exports = User;
