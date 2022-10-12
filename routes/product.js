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
        Review.find({ product: product._id })
          .sort({ createdAt: -1 })

          .then((reviews) => {
            //check current user gave review or not
            let currentUserReview
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
  Review.findOne({ author: req.user._id }).then((user) => {
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
      res.redirect(`/product/${req.params.id}`)
    })
    .catch((error) => {
      res.status(404).json({message:"something went wrong"})
    })
})

//delete a review
router.delete('/:id', ensureAuth, (req, res) => {
  console.log('delete route hit')

  Review.findOneAndDelete({ author: req.user.id })
    .then((review) => {
     console.log('deleted')
    })
    .catch((error) => {
      console.log('something went wrng')
    })
})



// //get write route
// router.get('/write', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.render('write.ejs', { authenticated: true })
//   } else {
//     res.redirect('/signup')
//   }
// })
//get all blogs
// router.get('/blogs', (req, res) => {
//   Blog.find()
//     .populate('author')
//     .then((blogs) => {
//       blogs.reverse()
//       if (req.isAuthenticated()) {
//         res.render('blogs.ejs', {
//           blogs,
//           authenticated: true,
//           user: req.user.id,
//         })
//       } else {
//         res.render('blogs.ejs', { blogs, authenticated: false })
//       }
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// })
// //post blog
// router.post('/write', async (req, res) => {
//   const { title, desc, body } = req.body
//   let blog = {
//     title,
//     shortDescription: desc,
//     body,
//     author: req.user._id,
//   }
//   Blog.create(blog, (err, blog) => {
//     console.log('new blog created')
//   })
//   res.redirect('/blog/blogs')
// })

// //get each blog
// router.get('/:id', (req, res) => {
//   Blog.findById(req.params.id)
//     .populate('author')
//     .then((blog) => {
//       if (req.isAuthenticated()) {
//         res.render('blog.ejs', { blog: blog, authenticated: true })
//       } else {
//         res.render('blog.ejs', { blog: blog, authenticated: false })
//       }
//     })
//     .catch((err) => console.log(err))
// })

// // get edit route
// router.get('/edit/:id', ensureAuth, (req, res) => {
//   Blog.findById(req.params.id)
//     .then((blog) => {
//       if (req.user.id == blog.author._id) {
//         res.render('edit.ejs', { blog: blog, authenticated: true })
//       } else {
//         console.log('error')
//         res.status('404').json('you are not authorized to edit this blog')
//       }
//     })
//     .catch((err) => console.log(err))
// })
// // post edited blog
// router.post('/edit/:id', (req, res) => {
//   const { title, desc, body } = req.body
//   Blog.findById(req.params.id)
//     .then((blog) => {
//       if (req.user.id == blog.author._id) {
//         Blog.findByIdAndUpdate(req.params.id, {
//           title,
//           shortDescription: desc,
//           body,
//         })
//           .then((blog) => {
//             console.log('posted')
//             res.redirect('/blog/blogs')
//           })
//           .catch((err) => console.log(err))
//       }
//     })
//     .catch((err) => console.log(err))
// })

// //delete blog
// router.delete('/delete/:id', (req, res) => {
//   Blog.findByIdAndDelete(req.params.id, (err, blog) => {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log('deleted')
//     }
//   })
//   res.send('deleted')
// })
module.exports = router
