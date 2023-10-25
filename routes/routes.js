const express = require("express")
const PessoaController = require("../controllers/PessoaController")
const ticketController = require("../controllers/TicketController")
const {autenticado,admin} = require("../security/authorization")
// const multerController = require("../controllers/multerController")

const routes = express.Router()

//página inicial
routes.get("/",(req,res)=>{
    res.status(200).render("pages/index",{
        pessoaId:1
    })
})


//rotas de tickets
routes.get("/ticket/:pessoaId/:ticketId/update",ticketController.getUpdatePage)

routes.get("/ticket/:pessoaId",ticketController.getAll)
routes.get("/ticket/:pessoaId/:ticketId",ticketController.getById)
routes.post("/novoticket/:pessoaId",ticketController.create)
routes.put("/ticket/:pessoaId/:ticketId",ticketController.update)
routes.delete("/ticket/:pessoaId/:ticketId",ticketController.delete)
routes.get("/ticket-form",autenticado,ticketController.getRegisterPage)


//rotas de pessoas
routes.get("/form-login",PessoaController.getLoginPage)
routes.post("/login",PessoaController.login)
routes.post("/logar",PessoaController.logar)
routes.get("/pessoas/novo",PessoaController.getRegisterPage)
routes.get("/pessoas/:pessoaId/update",PessoaController.getUpdatePage)
routes.get("/logout",PessoaController.logout)

routes.get("/pessoas",admin,PessoaController.getAll)
routes.get("/pessoas/:pessoaId",PessoaController.getById)
routes.post("/pessoas",PessoaController.create)
routes.put("/pessoas/:pessoaId",admin,PessoaController.update)
routes.delete("/pessoas/:pessoaId",admin,PessoaController.delete)


module.exports = routes