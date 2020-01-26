const Sequelize = require("sequelize");
const db = require("../db");

const Attachment = db.getDB().define("attachment", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  creatorId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  requirementId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  txId: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  data: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.TIME
  },
  updatedAt: {
    type: Sequelize.TIME
  }
});

module.exports = Attachment;
