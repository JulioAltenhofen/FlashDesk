const DataTypes = require("sequelize");
const db = require("../config/dbconnection")

const Resposta = db.define('resposta', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    respostas: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "ticket", key: "id" }
    },
    dataResposta: {
      type: DataTypes.STRING,
      allowNull: false
    },
    anexoResposta: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    nomeanexoFormatado: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    pessoaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "pessoa", key: "id" }
    }
     });

module.exports = Resposta;