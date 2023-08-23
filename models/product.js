const DataTypes = require("sequelize");
const db = require("../config/dbconnection")

const Produto = db.define('produto', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

(async () => {
    try {
        await Produto.sync({ force: false }); //{ force: true }
        console.log('Tabela de Produto criada com sucesso.');

    } catch (error) { 
        console.error('Não foi possível conectar-se ao banco de dados:', error);
    }
})(); 

module.exports = Produto