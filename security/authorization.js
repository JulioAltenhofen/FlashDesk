const { or } = require("sequelize")

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
    },
    acessarProprioRecurso: function(req,res,next){
        if(req.isAuthenticated() && req.user.id == req.params.pessoaId || req.user.role == "admin"){
            return next()
        }else if(!req.isAuthenticated()){
            //req.flash("error_msg","Você precisa realizar login!")
            res.status(401).render("pages/error",{error: "Você precisa realizar login!"})
        }else{
            //req.flash("error_msg","Você não tem autorização para visualizar este pedido!")
            res.status(401).render("pages/error",{error: "Você não tem autorização para visualizar esta página!"})
        }
    }
}
