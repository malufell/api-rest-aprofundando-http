const Sequelize = require('sequelize')
const database = require('../../database/config')

const colunas = {
  titulo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  preco: {
    type: Sequelize.DOUBLE, // nº com ponto flutuante
    allowNull: false
  },
  estoque: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0 // inicia produto com quantidade zero se não informar nada
  },
  // relacionando com a tabela fornecedores:
  fornecedor: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: require('../fornecedores/ModeloTabelaFornecedor'),
      key: 'id'
    }
  }
}

const opcoes = {
  freezeTableName: true,
  tableName: 'produtos',
  timestamps: true,
  createdAt: 'dataCriacao',
  updatedAt: 'dataAtualizacao',
  version: 'versao'
}

module.exports = database.define('produto', colunas, opcoes)
