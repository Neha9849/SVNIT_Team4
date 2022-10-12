const express = require("express");
const router = express.Router();
const passport = require("passport");

//route which redirects the user to google
router.get("/google", passport.authenticate("google"));

//popup where authentication is done
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
    
  }
);

//logout route
router.get('/logout',(req,res) => {
    req.logout();
    res.redirect('/')
})

module.exports = router;
