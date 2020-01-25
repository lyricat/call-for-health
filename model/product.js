const Sequelize = require("sequelize");
const db = require("../db");

const Product = db.getDB().define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  model: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
  },
  createdAt: {
    type: Sequelize.TIME
  },
  updatedAt: {
    type: Sequelize.TIME
  }
});

module.exports = Product;
