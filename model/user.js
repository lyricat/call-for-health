const Sequelize = require("sequelize");
const db = require("../db");

const User = db.getDB().define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  weiboId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  kycState: {
    type: Sequelize.INTEGER,
    default: 0
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.TIME
  },
  updatedAt: {
    type: Sequelize.TIME
  }
});

module.exports = User;