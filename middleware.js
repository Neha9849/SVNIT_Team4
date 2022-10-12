module.exports={
    ensureAuth: function(req, res, next) {
        if(req.isAuthenticated()){
            next();

        }
        else{
            let errors=["Please Sign in"];
            res.redirect('/',204);

        }
    }
}