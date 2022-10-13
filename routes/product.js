const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { ensureAuth } = require('../middleware')
const { populate } = require('../models/product')
const Product = require('../models/product')
const Review = require('../models/review')
const User = require('../models/user')

//get single product
router.get('/:id', (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      // console.log(`product is ${product}`)
      if (product == null) {
        res.send('this product no longer exists check url')
      } else {
        //get this product reviews
        Review.find({ product: product._id }).populate("author")
          .sort({ createdAt: -1 })

          .then((reviews) => {
            //check current user gave review or not
            let currentUserReview =null
            Review.find({ product: product._id, author: req.user.id }).then(
              (review) => {
                if (review) {
                  currentUserReview = review
                }
                if (req.isAuthenticated()) {
                  res.render('product.ejs', {
                    authenticated: true,
                    product,
                    reviews,
                    currentUserReview,
                  })
                } else {
                  res.render('product.ejs', {
                    authenticated: false,
                    product,
                    reviews,
                    currentUserReview,
                  })
                }
              },
            )
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
    .catch((error) => {
      console.error(error)
    })
})

//post a review
router.post('/:id', ensureAuth, (req, res) => {
  const { rating, review } = req.body
  Review.findOne({product:req.params.id, author: req.user._id }).then((user) => {
    if (user) {
      //already sent review
      console.log('you already reviewed')
    } else {
      //add review to db
      Review.create({
        rating,
        review,
        author: req.user._id,
        product: req.params.id,
      })
        .then((review) => {
          Product.findById(req.params.id).then(product => {
            let oldRatingArray = product.rating
            oldRatingArray = [...oldRatingArray,rating]
            let sum=0;
            oldRatingArray.forEach(rating =>{
             sum=Number(sum)+Number(rating)
            }
              )
              sum= sum+rating / (oldRatingArray.length+1);
            Product.findByIdAndUpdate(req.params.id,{rating:oldRatingArray,avgRating:sum}).then((updated)=>{
              console.log('avg rating updated')
            }).catch((error) => {console.log(error)});
          }).catch((error) => {console.log(error)})
          res.redirect(`/product/${req.params.id}`)
         
        })
        .catch((error) => {
          res.status(404).json({message:"something went wrong"})
          console.log(error)
        })
    }
  })
})

//edit a review
router.post('/edit/:id', (req, res) => {
  console.log('put hit')
  const { rating, review } = req.body
  Review.findOneAndUpdate({ author: req.user.id }, { rating, review })
    .then((review) => {
      console.log('updated')
      res.redirect(`/product/${req.params.id}`)
    })
    .catch((error) => {
      console.log('something wrng while update')
      res.status(404).json({message:"something went wrong"})
    })
})

//delete a review
router.delete('/:id', ensureAuth, (req, res) => {
  console.log('delete route hit')

  Review.findOneAndDelete({ author: req.user.id })
    .then((review) => {
      res.redirect(`/product/${req.params.id}`)
     console.log('deleted')
    })
    .catch((error) => {
      console.log('something went wrng')
    })
})


//get avg rating of a particular product

module.exports = router
