const express = require("express")
const PessoaController = require("../controllers/PessoaController")
const ticketController = require("../controllers/TicketController")
const {autenticado,admin} = require("../security/authorization")

const routes = express.Router()

//página inicial
routes.get("/",(req,res)=>{
    res.status(200).render("pages/index",{
        pessoaId:1
    })
})

//rotas de tickets
routes.get("/ticket/:pessoaId/:ticketId/update",ticketController.getUpdatePage)

routes.get("/ticket/:pessoaId",admin,ticketController.getAll)
routes.get("/ticket/:pessoaId/:ticketId",ticketController.getById)
routes.post("/ticket/:pessoaId",ticketController.create)
routes.put("/ticket/:pessoaId/:ticketId",ticketController.update)
routes.delete("/ticket/:pessoaId/:ticketId",ticketController.delete)

//rotas de pessoas
routes.get("/form-login",PessoaController.getLoginPage)
routes.post("/login",PessoaController.login)
routes.post("/logar",PessoaController.logar)
routes.get("/pessoas/novo",admin,PessoaController.getRegisterPage)
routes.get("/pessoas/:pessoaId/update",PessoaController.getUpdatePage)

routes.get("/pessoas",PessoaController.getAll)
routes.get("/pessoas/:pessoaId",PessoaController.getById)
routes.post("/pessoas",PessoaController.create)
routes.put("/pessoas/:pessoaId",admin,PessoaController.update)
routes.delete("/pessoas/:pessoaId",admin,PessoaController.delete)

module.exports = routes