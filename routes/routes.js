const express = require("express")
const ProductController = require("../controllers/ProductController")
const PessoaController = require("../controllers/PessoaController")
const EnderecoController = require("../controllers/EnderecoController")
const PedidoController = require("../controllers/PedidoController")
const {autenticado,admin} = require("../security/authorization")

const routes = express.Router()

//página inicial
routes.get("/",(req,res)=>{
    res.status(200).render("pages/index",{
        pessoaId:1
    })
})

//rotas de produtos
routes.get("/produtos/novo",ProductController.getRegisterPage)
routes.get("/produtos/:produtoId/update",ProductController.getUpdatePage)

routes.get("/produtos",autenticado,ProductController.getAll)
routes.get("/produtos/:produtoId",ProductController.getById)
routes.post("/produtos",ProductController.create)
routes.put("/produtos/:produtoId",ProductController.update)
routes.delete("/produtos/:produtoId",ProductController.delete)

//rotas de pedidos
routes.get("/pedidos/:pessoaId/:pedidoId/update",PedidoController.getUpdatePage)

routes.get("/pedidos/:pessoaId",admin,PedidoController.getAll)
routes.get("/pedidos/:pessoaId/:pedidoId",PedidoController.getById)
routes.post("/pedidos/:pessoaId",PedidoController.create)
routes.put("/pedidos/:pessoaId/:pedidoId",PedidoController.update)
routes.delete("/pedidos/:pessoaId/:pedidoId",PedidoController.delete)

//rotas de pessoas
routes.get("/form-login",PessoaController.getLoginPage)
routes.post("/login",PessoaController.login)
routes.post("/logar",PessoaController.logar)
routes.get("/pessoas/novo",PessoaController.getRegisterPage)
routes.get("/pessoas/:pessoaId/update",PessoaController.getUpdatePage)

routes.get("/pessoas",PessoaController.getAll)
routes.get("/pessoas/:pessoaId",PessoaController.getById)
routes.post("/pessoas",PessoaController.create)
routes.put("/pessoas/:pessoaId",PessoaController.update)
routes.delete("/pessoas/:pessoaId",PessoaController.delete)

module.exports = routes