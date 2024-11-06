const Sequelize = require('sequelize')
const db = require('./database.js')
const users = require('./users.js')
const groups = db.define('groups', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(128),
    unique: true,
    validate: {
      is: /^[a-z\-'\s]{1,128}$/i
    }
  }
}, { timestamps: false })

users.hasMany(groups, {
  as: 'own',
  foreignKey: 'ownerId',
  onDelete: 'CASCADE'
})
groups.belongsTo(users, { as: 'owner', foreignKey: 'ownerId' })

users.belongsToMany(groups, {
  through: 'User_Group',
  foreignKey: 'member_id',
  onDelete: 'CASCADE'
})
groups.belongsToMany(users, {
  as: 'member',
  through: 'User_Group',
  foreignKey: 'groupId'
})

module.exports = groups
