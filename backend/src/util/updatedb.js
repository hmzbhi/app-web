const userModel = require('../models/users.js')
const bcrypt = require('bcrypt')
const groupModel = require('../models/groups.js')
const messageModel = require('../models/messages.js');

// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // Regénère la base de données
  await require('../models/database.js').sync({ force: true })
  console.log('Base de données créée.')
  // Initialise la base avec quelques données
  const passhash = await bcrypt.hash('123456', 2)
  console.log(passhash)
  const hamza = await userModel.create({
    name: 'test Hamza', email: 'test@hamza.fr', passhash, isAdmin: true
  })
  await userModel.create({
    name: 'Sebastien Viardot', email: 'Sebastien.Viardot@grenoble-inp.fr', passhash, isAdmin: true
  })

  const justMember = await userModel.create({
    name: 'Just Member', email: 'just@member.fr', passhash, isAdmin: false
  })

  await userModel.create({
    name: 'alice', email: 'alice@test.fr', passhash, isAdmin: false
  })

  const gr = await groupModel.create({
    name: 'groupe', ownerId: 1
  })
  gr.addMember(hamza)
  gr.addMember(justMember)

  await messageModel.create({
    content: 'Hello !', uid: 1, gid: 1, name: 'test Hamza'
  })
})()
