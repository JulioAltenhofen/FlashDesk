const DataTypes = require("sequelize");
const db = require("../config/dbconnection")

const PedidoProduto = db.define('pedidoProduto', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  pedidoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "pedido", key: "id" },
    onDelete: "CASCADE"
  },
  produtoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "produto", key: "id" },
    onDelete: "CASCADE"
  },
  cor: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

(async () => {
  try {
    await PedidoProduto.sync({ force: false }); //{ force: true }
    console.log('Tabela de pedidoProduto criada com sucesso.');

  } catch (error) {
    console.error('Não foi possível conectar-se ao banco de dados:', error);
  }
})();

module.exports = PedidoProduto