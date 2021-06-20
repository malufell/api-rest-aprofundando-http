const Sequelize = require('sequelize')

const database = new Sequelize(
  'curso_rest_api',
  'root',
  'admin',
  {
    host: '127.0.0.7',
    dialect: 'mysql'
  }
)

module.exports = database
