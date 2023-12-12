const DataTypes = require("sequelize");
const db = require("../config/dbconnection")

const Ticket = db.define('ticket', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    campoTexto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    urgencia: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pessoaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "pessoa", key: "id" }
    },
    anexo: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    nomeanexo: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

module.exports = Ticket;