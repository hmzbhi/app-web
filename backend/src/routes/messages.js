const express = require('express')
const router = express.Router()
const messages = require('../controllers/messages.js')
const groups = require('../controllers/groups.js')

// middlewar to verify privileges
router.use('/api/messages/:gid', groups.verifyGroup, messages.verifyMember)

router.get('/api/messages/:gid', messages.getMessages)
router.post('/api/messages/:gid', messages.sendMessage)

module.exports = router
