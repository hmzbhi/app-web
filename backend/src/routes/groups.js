const express = require('express')
const router = express.Router()
const groups = require('../controllers/groups.js')

// free access
router.get('/api/mygroups', groups.getGroups)
router.post('/api/mygroups', groups.newGroup)

router.get('/api/groupsmember', groups.getGroupUser)

// middleware to verify privileges
router.use('/api/mygroups/:gid', groups.verifyGroup, groups.verifyGroupAccess)
router.use('/api/mygroups/:gid/:uid', groups.verifyUser)

// restricted access
router.get('/api/mygroups/:gid', groups.getGroupMembers)
router.delete('/api/mygroups/:gid', groups.verifyAdminOwner, groups.deleteGroup)

router.put('/api/mygroups/:gid/:uid', groups.addGroupMember)
router.delete('/api/mygroups/:gid/:uid', groups.deleteGroupMember)

module.exports = router
