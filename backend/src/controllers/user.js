const status = require('http-status')
const userModel = require('../models/users.js')
const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
const bcrypt = require('bcrypt')
const jws = require('jws')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env

function validPassword (password) {
  return /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)
}

async function verifieTokenPresent (req, res, next) {
  // Code vérifiant qu'il y a bien un token dans l'entête
  // Le commentaire suivant couplé à une définition d'apiKeyAuth permet de générer la documentation avec swagger_autogen
  // cf. https://swagger-autogen.github.io/docs/swagger-2/authentication/api-keys-token/
  // #swagger.security = [{"apiKeyAuth": []}]
  if (!req.headers || !Object.prototype.hasOwnProperty.call(req.headers, 'x-access-token')) {
    throw new CodeError('Token missing', status.FORBIDDEN)
  }
  // Code vérifiant la validité du token
  if (!jws.verify(req.headers['x-access-token'], 'HS256', TOKENSECRET)) {
    throw new CodeError('Token invalid', status.FORBIDDEN)
  }
  // Le payload du token contient le login de l'utilisateur
  // On modifie l'objet requête pour mettre le login à disposition pour les middleware suivants
  req.login = jws.decode(req.headers['x-access-token']).payload
  // On vérifie que le token est dans la BDD:
  const logged = await userModel.findOne({ where: { email: req.login } })
  req.logged = logged

  if (!logged) {
    throw new CodeError('inconsistent token', status.FORBIDDEN)
  }
  // On appelle la fonction middleware suivante :
  next()
}

async function verifieAdmin (req, res, next) {
  // Code vérifiant que le login est admin (présent si une fonction middleware
  // a au préalable ajouté le login dans req)
  const user = await userModel.findOne({ where: { email: req.login } })
  if (!user.isAdmin) {
    // Provoque une réponse en erreur avec un code de retour 403
    throw new CodeError('Forbidden', status.FORBIDDEN)
  }
  // On appelle la fonction middleware suivante que si la condition est vérifiée
  next()
}

module.exports = {
  async login (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Verify credentials of user using email and password and return token'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $email: 'John.Doe@acme.com', $password: '12345'}}
    if (!has(req.body, ['email', 'password'])) throw new CodeError('You must specify the email and password', status.BAD_REQUEST)
    const { email, password } = req.body
    const user = await userModel.findOne({ where: { email } })
    if (user) {
      if (await bcrypt.compare(password, user.passhash)) {
        const token = jws.sign({ header: { alg: 'HS256' }, payload: email, secret: TOKENSECRET })
        res.json({ status: true, message: 'Login/Password ok', token, name: user.name })
        return
      }
    }
    res.status(status.FORBIDDEN).json({ status: false, message: 'Wrong email/password' })
  },
  async newUser (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'New User'
    // #swagger.parameters['obj'] = { in: 'body', description:'Name and email', schema: { $name: 'John Doe', $email: 'John.Doe@acme.com', $password: '1m02P@SsF0rt!'}}
    if (!has(req.body, ['name', 'email', 'password'])) throw new CodeError('You must specify the name and email', status.BAD_REQUEST)
    const { name, email, password } = req.body
    console.log(req.body)
    if (!validPassword(password)) throw new CodeError('Weak password!', status.BAD_REQUEST)
    await userModel.create({ name, email, passhash: await bcrypt.hash(password, 2), isAdmin: false }) // Ajout de isAdmin: false lors de la création de l'utilisateur
    res.json({ status: true, message: 'User Added' })
  },
  async getUsers (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get All users'
    const data = await userModel.findAll({ attributes: ['id', 'name', 'email'] })
    res.json({ status: true, message: 'Returning users', data })
  },
  async updatePassword (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Update password'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $password: '1m02P@SsF0rt!'}}
    if (!has(req.body, 'password')) throw new CodeError('You must specify the password', status.BAD_REQUEST)
    if (!validPassword(req.body.password)) throw new CodeError('Weak password!', status.BAD_REQUEST)
    await userModel.update({ passhash: await bcrypt.hash(req.body.password, 2) }, { where: { email: req.login } })
    res.json({ status: true, message: 'Password updated' })
  },
  async updateUser (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Mettre à jour les informations de l utilisateur (réservé à un utilisateur administrateur)'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $name: 'John Doe', $email: 'John.Doe@acme.com', $password: '1m02P@SsF0rt!', $isAdmin: false }}
    const userModified = {}
    for (const field of ['name', 'email', 'password', 'isAdmin']) {
      if (has(req.body, field)) {
        if (field === 'password') {
          userModified.passhash = await bcrypt.hash(req.body.password, 2)
        } else {
          userModified[field] = req.body[field]
        }
      }
    }
    if (Object.keys(userModified).length === 0) throw new CodeError('You must specify the name, email or password', status.BAD_REQUEST)
    await userModel.update(userModified, { where: { id: req.params.id } })
    res.json({ status: true, message: 'User updated' })
  },
  async deleteUser (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Delete User'
    if (!has(req.params, 'id')) throw new CodeError('You must specify the id', status.BAD_REQUEST)
    const { id } = req.params
    await userModel.destroy({ where: { id } })
    res.json({ status: true, message: 'User deleted' })
  },
  verifieTokenPresent,
  verifieAdmin
}
