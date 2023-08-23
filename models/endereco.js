const DataTypes = require("sequelize");
const db = require("../config/dbconnection")

const Endereco = db.define('endereco', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rua: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pessoaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "pessoa", key: "id" },
      onDelete: "CASCADE"
    },
  });

 

(async () => {
    try {
        await Endereco.sync(); //{ force: true }
        console.log('Tabela de Endereco criada com sucesso.');

    } catch (error) { 
        console.error('Não foi possível conectar-se ao banco de dados:', error);
    }
})();

module.exports = Endereco