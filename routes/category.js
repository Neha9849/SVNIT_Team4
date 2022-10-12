const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware')
const Product = require('../models/product')

//categories page
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('category.ejs', { authenticated: true })
  } else {
    res.render('category.ejs', { authenticated: false })
  }
})
//products page(based on category)
router.get('/:category',(req, res) => {
  const category = req.params.category
  Product.find({category}).then((products)=>{
    console.log(products)
    res.render('products.ejs',{
      authenticated:true,
      products
    })
  }).catch((err) => {console.log(err)})

})
module.exports = router