const Sequelize = require('sequelize')
const conf = require('./config.json')

const db = new Sequelize(conf.fallback_db.datebase, conf.fallback_db.username, conf.fallback_db.password, {
  host: conf.fallback_db.host,
  port: conf.fallback_db.port,
  dialect: conf.fallback_db.type,
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
})

module.exports = {
  getDB: () => {
    return db
  },
  testDb: () => {
    db.authenticate().then(() => {
      console.log('Connection has been established successfully.');
    }).catch(err => {
      console.error('Unable to connect to the database:', err);
    })
  }
}