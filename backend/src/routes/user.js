const express = require('express')
const router = express.Router()
const user = require('../controllers/user.js')

router.post('/login', user.login)
router.post('/register', user.newUser)

// verifie le token pour /api/
router.use('/api/', user.verifieTokenPresent)

router.get('/api/users', user.getUsers)
router.put('/api/password', user.updatePassword)

// verifie les droits d'admin pour /api/users
router.use('/api/users/:id', user.verifieAdmin)

router.put('/api/users/:id', user.updateUser)
router.delete('/api/users/:id', user.deleteUser)

// obliger sinon error 404 au lieu de 400 car il ne trouve pas l'endpoint sans id
router.delete('/api/users/', user.verifieAdmin, user.deleteUser)

module.exports = router
