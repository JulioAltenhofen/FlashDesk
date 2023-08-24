const Pessoa = require("../models/pessoa")
const Ticket = require("../models/ticket")
const db = require("../config/dbconnection")

Pessoa.hasMany(Ticket,{onDelete:"CASCADE"})
Ticket.belongsTo(Pessoa,{foreingKey:"pessoaId"})

db.sync({ force: false })  

module.exports = {Pessoa, Ticket}