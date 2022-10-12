const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware')
const Product = require('../models/product')
const Review = require('../models/review')
//Home Page
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('Home.ejs', { authenticated: true })
  } else {
    res.render('Home.ejs', { authenticated: false })
  }
})

//signup page
router.get('/signup', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('Login.ejs', { authenticated: true })
  } else {
    res.render('Login.ejs', { authenticated: false })
  }
})


//get dashboard
router.get('/dashboard',ensureAuth,(req,res) => {
    Review.find({author:req.user.id}).then((reviews)=>{
      res.render('dashboard.ejs',{
        user:req.user,
        authenticated:true,
        reviews
      })
    }).catch((err) => {console.log(err)})


})

module.exports = router
