const express = require("express")
const PessoaController = require("../controllers/PessoaController")
const ticketController = require("../controllers/TicketController")
const RespostasController = require("../controllers/RespostasController")
const {autenticado,admin, acessarProprioRecurso} = require("../security/authorization")

const routes = express.Router()

//página inicial
routes.get("/",(req,res)=>{
    if (req.isAuthenticated()){
        res.status(200).render("pages/index",{
            pessoaId:req.user.id}) 
        } else {
            res.status(200).render("pages/index")
        }

})

//rotas de tickets
routes.get("/ticket/:pessoaId/:ticketId/update",acessarProprioRecurso,ticketController.getUpdatePage)
routes.get("/ticket/:pessoaId",acessarProprioRecurso,ticketController.getAll)
routes.get("/tickets",acessarProprioRecurso,ticketController.getAllAdmin)
routes.get("/ticket/:pessoaId/:ticketId",acessarProprioRecurso,ticketController.getById)
routes.post("/novoticket/:pessoaId",autenticado,ticketController.create)
routes.delete("/tickets/:pessoaId/:ticketId",acessarProprioRecurso,ticketController.delete)
routes.get("/ticket-form/:pessoaId",autenticado,ticketController.getRegisterPage)
routes.get("/ticket/:pessoaId/:ticketId/anexo",autenticado,ticketController.getAnexo)
routes.get("/baseconhecimento/:termoDeBusca",autenticado,ticketController.getBaseConhecimento)
routes.get("/ticketsugestao/:ticketId",ticketController.getByIdSugestao)



//rotas de respostas
routes.post("/ticket/:pessoaId/:ticketId",acessarProprioRecurso,RespostasController.createResposta)
routes.post("/ticket/:pessoaId/:ticketId/reabrir",acessarProprioRecurso,RespostasController.reabrirTicket)
routes.get("/ticket/:pessoaId/:ticketId/anexores",autenticado,RespostasController.getAnexoResposta)

//rotas de pessoas
routes.get("/form-login",PessoaController.getLoginPage)
routes.post("/login",PessoaController.login)
routes.post("/logar",PessoaController.logar)
routes.get("/pessoas/novo",PessoaController.getRegisterPage)
routes.get("/pessoas/:pessoaId/update",admin,PessoaController.getUpdatePage)
routes.get("/logout",PessoaController.logout)
routes.get("/pessoas",admin,PessoaController.getAll)
routes.get("/pessoas/:pessoaId",acessarProprioRecurso,PessoaController.getById)
routes.post("/pessoas",PessoaController.create)
routes.put("/pessoas/:pessoaId",admin,PessoaController.update)
routes.delete("/pessoas/:pessoaId",admin,PessoaController.delete)


module.exports = routes