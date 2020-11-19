const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  given_name: {
    type: String,
    required: true,
  },

  family_name: {
    type: String,
    required: true,
  },

  picture: {
    type: String,
  },

  secret_key: {
    type: String,
    required: true,
    unique: true,
  },

  two_factors_activated: {
    type: Boolean,
    required: true,
  },

  role: {
    type: String,
    required: true,
  },
});

module.exports = model("User", UserSchema);
