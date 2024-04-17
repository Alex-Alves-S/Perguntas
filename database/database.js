const Sequelize = require('sequelize');

const connection = new Sequelize('db_perguntas','root','98532',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;