const Sequelize = require("sequelize");
const db = require("../db");

const Requirement = db.getDB().define("requirement", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  creatorId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  txId: {
    // network tx id
    type: Sequelize.STRING
  },
  latestTxId: {
    // latest network tx id
    type: Sequelize.STRING
  },
  text: {
    type: Sequelize.STRING
  },
  location: {
    type: Sequelize.STRING
  },
  contacts: {
    type: Sequelize.STRING
  },
  products: {
    type: Sequelize.JSON,
    allowNull: false
  },
  sourceUrl: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "PENDING"
  },
  createdAt: {
    type: Sequelize.TIME
  },
  updatedAt: {
    type: Sequelize.TIME
  }
});

module.exports = Requirement;
