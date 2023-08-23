const DataTypes = require("sequelize");
const db = require("../config/dbconnection")

const Pedido = db.define('pedido', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    valor: {
      type: DataTypes.FLOAT,
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
        await Pedido.sync({ force: false }); //{ force: true }
        console.log('Tabela de Pedido criada com sucesso.');

    } catch (error) { 
        console.error('Não foi possível conectar-se ao banco de dados:', error);
    }
})();

module.exports = Pedido