const status = require('http-status')
const has = require('has-keys')
const messageModel = require('../models/messages.js')
const CodeError = require('../util/CodeError.js')

async function verifyMember (req, res, next) {
  const isHere = await req.group.hasMember(req.logged)
  if (!isHere) throw new CodeError('You must be in the group', status.FORBIDDEN)
  next()
}

module.exports = {

  async getMessages (req, res) {
    // #swagger.tags = ['Messages']
    // #swagger.summary = 'Get all the messages posted in a group'
    // #swagger.parameters['obj'] = {}

    const data = await messageModel.findAll({ attributes: ['content', 'name'], where: { gid: req.params.gid } })
    res.json({ status: true, message: 'messages', data })
  },

  async sendMessage (req, res) {
    // #swagger.tags = ['Messages']
    // #swagger.summary = 'Send a message in a group'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $content: 'Hello !'}}
    if (!has(req.body, ['content'])) throw new CodeError('You must specify the content of the message', status.BAD_REQUEST)

    const { content } = req.body
    await messageModel.create({ content: content, uid: req.logged.id, gid: req.params.gid, name: req.logged.name })

    res.json({ status: true, message: 'Message posted' })
  },
  verifyMember
}
