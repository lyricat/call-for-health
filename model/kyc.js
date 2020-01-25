const Sequelize = require("sequelize");
const db = require("../db");

const KYC = db.getDB().define("kyc", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  state: {
    type: Sequelize.INTEGER,
    default: 0
  },
  bizToken: {
    type: Sequelize.STRING
  },
  resultCode: {
    type: Sequelize.STRING
  },
  resultMessage: {
    type: Sequelize.STRING
  },
  errorMessage: {
    type: Sequelize.STRING
  },
  data: {
    type: Sequelize.STRING
  },
  realName: {
    type: Sequelize.STRING
  },
  realId: {
    type: Sequelize.STRING
  },
  uniqueHash: {
    type: Sequelize.STRING
  },
  passedAt: {
    type: Sequelize.TIME
  },
  expiredAt: {
    type: Sequelize.TIME
  },
  createdAt: {
    type: Sequelize.TIME
  },
  updatedAt: {
    type: Sequelize.TIME
  }
});

module.exports = KYC;
