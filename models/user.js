const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
})
const User = mongoose.model('user', UserSchema)
module.exports = User
