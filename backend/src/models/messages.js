const Sequelize = require('sequelize')
const db = require('./database.js')
const users = require('./users.js')
const groups = require('./groups.js')

const messages = db.define('messages', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  content: {
    type: Sequelize.STRING(128)
  },
  name: {
    type: Sequelize.STRING(128),
    validate: {
      is: /^[a-z\-'\s]{1,128}$/i
    }
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, { timestamps: false })

users.hasMany(messages, {
  as: 'post',
  foreignKey: 'uid',
  onDelete: 'CASCADE'
})

messages.belongsTo(users, {
  as: 'author',
  foreignKey: 'uid'
})

groups.hasMany(messages, {
  as: 'message',
  foreignKey: 'gid',
  onDelete: 'CASCADE'
})

messages.belongsTo(groups, {
  as: 'group',
  foreignKey: 'gid'
})

module.exports = messages
