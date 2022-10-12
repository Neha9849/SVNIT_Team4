const mongoose = require('mongoose')
const ReviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      trim: true,
      deafalt:0
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true },
)
const Review = mongoose.model('reviews', ReviewSchema)
module.exports = Review
