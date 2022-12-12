const Sequelize = require('sequelize');
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize('node-complete', 'root', 'nodecomplete', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
