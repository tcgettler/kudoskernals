const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: "Username is Required"
  },
  password: {
    type: String,
    trim: true,
    required: "Password is Required"
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "note"
    }
  ]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;