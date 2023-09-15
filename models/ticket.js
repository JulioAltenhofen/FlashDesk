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
    corpo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pessoaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "pessoa", key: "id" },
      onDelete: "CASCADE",
    },
  });

(async () => {
    try {
        await Ticket.sync({ force: false }); //{ force: true }
        console.log('Tabela de Pedido criada com sucesso.');

    } catch (error) { 
        console.error('Não foi possível conectar-se ao banco de dados:', error);
    }
})();

module.exports = Ticket