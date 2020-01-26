const Sequelize = require("sequelize");
const db = require("../db");

const User = db.getDB().define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  salt: {
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  weiboId: {
    type: Sequelize.STRING,
  },
  kycState: {
    type: Sequelize.INTEGER,
    default: 0
  },
  role: {
    type: Sequelize.STRING,
  },
  createdAt: {
    type: Sequelize.TIME
  },
  updatedAt: {
    type: Sequelize.TIME
  }
});

module.exports = User;