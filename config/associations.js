const Pessoa = require("../models/pessoa")
const Endereco = require("../models/endereco")
const Pedido = require("../models/pedido")
const Produto = require("../models/product")
const Cor = require("../models/cor")
const PedidoProduto = require("../models/pedidoProduto")
const db = require("../config/dbconnection")


Pessoa.hasOne(Endereco,{onDelete:"CASCADE"})
Endereco.belongsTo(Pessoa,{foreingKey:"pessoaId"})

Pessoa.hasMany(Pedido,{onDelete:"CASCADE"})
Pedido.belongsTo(Pessoa,{foreingKey:"pessoaId"})

Pedido.belongsToMany(Produto,{through:"pedidoProduto",onDelete:"CASCADE"})
Produto.belongsToMany(Pedido,{through:"pedidoProduto",onDelete:"CASCADE"})

Produto.belongsToMany(Cor,{through:"produtoCor",onDelete:"CASCADE"})
Cor.belongsToMany(Produto,{through:"produtoCor",onDelete:"CASCADE"})

db.sync({ force: false })  

module.exports = {Pessoa, Endereco, Pedido, Produto, Cor, PedidoProduto}