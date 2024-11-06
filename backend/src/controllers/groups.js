const status = require('http-status')
const userModel = require('../models/users.js')
const groupModel = require('../models/groups.js')
const has = require('has-keys')
const CodeError = require('../util/CodeError.js')

// middlewares
async function verifyGroup (req, res, next) {
  // verify if the group exists
  const group = await groupModel.findOne({ where: { id: req.params.gid } })
  if (!group) throw new CodeError('Group not found', status.NOT_FOUND)
  req.group = group
  next()
}

async function verifyGroupAccess (req, res, next) {
  // verify if the user has access to the group
  if (!(await req.group.hasMember(req.logged) || req.logged.isAdmin || req.group.ownerId === req.logged.id)) {
    throw new CodeError('You are neither an admin, nor the owner or member', status.FORBIDDEN)
  }
  next()
}

async function verifyUser (req, res, next) {
  // verify if the user exists
  const user = await userModel.findOne({ where: { id: req.params.uid } })
  if (!user) throw new CodeError('User not found', status.BAD_REQUEST)
  req.user = user
  next()
}

async function verifyAdminOwner (req, res, next) {
  // verify if the user is admin or owner of the group
  if (!(req.logged.isAdmin || req.group.ownerId === req.logged.id)) {
    throw new CodeError('You have to be the admin or the owner', status.FORBIDDEN)
  }
  next()
}

module.exports = {
  async getGroups (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Get all groups of the user'
    // #swagger.parameters['obj'] = {}
    let data
    if (req.logged.isAdmin) {
      data = await groupModel.findAll({ attributes: ['id', 'name', 'ownerId'] })
    } else {
      data = await groupModel.findAll({ attributes: ['id', 'name', 'ownerId'], where: { ownerId: req.logged.id } })
    }
    res.json({ status: true, message: 'Returning groups', data })
  },
  async newGroup (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Create a new group'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $name: 'MyGroup'}}
    if (!has(req.body, ['name'])) throw new CodeError('You must specify the name of the group', status.BAD_REQUEST)

    const { name } = req.body
    const group = await groupModel.create({ name: name, ownerId: req.logged.id })
    await group.addMember(req.logged)
    res.json({ status: true, message: 'Group Created' })
  },

  async getGroupMembers (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Get all members of a group'
    // #swagger.parameters['obj'] = {}
    const data = await req.group.getMember({ attributes: ['id', 'name', 'email'], joinTableAttributes: [] })
    res.json({ status: true, message: 'Returning members', data })
  },

  async deleteGroup (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Delete a group'
    // #swagger.parameters['obj'] = {}
    await groupModel.destroy({ where: { id: req.params.gid } })
    res.json({ status: true, message: 'Group deleted' })
  },

  async addGroupMember (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Add a user to a group'
    // #swagger.parameters['obj'] = {}
    if (await req.group.hasMember(req.user)) {
      res.status(status.BAD_REQUEST).json({ status: false, message: 'The user is already in the group' })
    } else {
      await req.group.addMember(req.user)
      res.json({ status: true, message: 'Member added' })
    }
  },

  async deleteGroupMember (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Remove a member from a group'
    // #swagger.parameters['obj'] = {}
    if (!(await req.group.hasMember(req.user))) {
      res.status(status.BAD_REQUEST).json({ status: false, message: 'The user is not in the group' })
    } else {
      if (req.logged.isAdmin || req.group.ownerId === req.logged.id || req.user.id === req.logged.id) {
        await req.group.removeMember(req.user)
        res.json({ status: true, message: 'Member removed' })
      } else {
        res.status(status.FORBIDDEN).json({ status: false, message: 'You are not allowed to remove this member' })
      }
    }
  },

  async getGroupUser (req, res) {
    // #swagger.tags = ['Groups']
    // #swagger.summary = 'Get all groups of a user'
    // #swagger.parameters['obj'] = {}
    const data = await req.logged.getGroups({ joinTableAttributes: [] })
    res.json({ status: true, message: 'Returning groups', data })
  },
  verifyGroup,
  verifyGroupAccess,
  verifyUser,
  verifyAdminOwner
}
