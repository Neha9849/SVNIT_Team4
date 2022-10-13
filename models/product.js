const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  prize: {
    type: Number,
    required: true,
  },
  rating: {
    type: [Number],
    required: true,
  },
  avgRating:{
    type:  Number,
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  image:{
    type: String,
    required: true,
  }
})
const Product = mongoose.model('products', ProductSchema)
module.exports = Product
