module.exports = {
    autenticado: function(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        //req.flash("error_msg","Você precisa realizar login!")
        res.status(401).render("pages/error",{error: "Você precisa realizar login!"})
    },
    admin: function(req,res,next){
        if(req.isAuthenticated() && req.user.role == "admin"){
            return next()
        }else if(!req.isAuthenticated()){
            res.status(401).render("pages/error",{error: "Você precisa realizar login!"})
        }else{
            res.status(401).render("pages/error",{error: "Você precisa ser um administrador!"})
        }
    }
}