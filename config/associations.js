const Pessoa = require("../models/pessoa")
const Ticket = require("../models/ticket")
const Respostas = require("../models/resposta")
const db = require("../config/dbconnection")

Pessoa.hasMany(Ticket,{onDelete:"CASCADE"})
Ticket.belongsTo(Pessoa,{foreingKey:"pessoaId"})

Ticket.hasMany(Respostas,{onDelete:"CASCADE"})
Respostas.belongsTo(Ticket,{foreingKey:"ticketId"})

Pessoa.hasMany(Respostas,{onDelete:"CASCADE"})
Respostas.belongsTo(Pessoa,{foreingKey:"pessoaId"})


db.sync({ force: false })  

module.exports = {Pessoa, Ticket, Respostas}