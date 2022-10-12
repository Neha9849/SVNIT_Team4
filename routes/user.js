const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware')
const Blog = require('../models/product')
const User = require('../models/user')
const mongoose = require('mongoose')
//get user by id
// router.get('/:id', (req, res) => {
//   const id = req.params.id
//   User.findById(id)
//     .then((user) => {
//       Blog.find({ author: id })
//         .then((blogs) => {
//           if (!req.isAuthenticated()) {
//             res.render('Profile.ejs', { user, blogs, authenticated: false })
//           } else {
//             if (id == req.user._id) {
//               res.render('dashboard.ejs', { user, blogs, authenticated: true })
//             } else {
//               res.render('Profile.ejs', { user, blogs, authenticated: true })
//             }
//           }
//         })
//         .catch((err) => {
//           console.log(err)
//         })
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// })

//update user profile
// router.post('/edit/:id', ensureAuth, (req, res) => {
//   const { About, linkedinLink, githubLink, discordId } = req.body
//   if (req.params.id == req.user._id) {
//     User.findByIdAndUpdate(req.params.id, {
//       About,
//       linkedinLink,
//       githubLink,
//       discordId,
//     })
//       .then(() => {
//         console.log('updated')
//         res.redirect('/dashboard')
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//   } else {
//     res.redirect('/dashboard')
//   }
// })
module.exports = router
