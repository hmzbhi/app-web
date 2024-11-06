const app = require('../app')
const request = require('supertest')

test('test listing groups created by the user', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'test@hamza.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  response = await request(app)
    .get('/api/mygroups')
    .set('x-access-token', response.body.token)
    .send({}) // Empty request body
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('message', 'Returning groups')
})

test('test creating a group', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'test@hamza.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // Create a new group
  response = await request(app)
    .post('/api/mygroups')
    .set('x-access-token', response.body.token)
    .send({ name: 'HamzaGroup' }) // Specify the name of the group
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('message', 'Group Created')
})

test('test getting group members', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'test@hamza.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
  // Get group members
  response = await request(app)
    .get('/api/mygroups/2')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('message', 'Returning members')
  // Add assertions to validate the response body if needed
})

test('test adding a member to a group', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'test@hamza.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // Add the new user to the group
  response = await request(app)
    .put('/api/mygroups/1/2')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('message', 'Member added')
})

test('test adding the same member to a group', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'test@hamza.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // Add the same user to the group
  response = await request(app)
    .put('/api/mygroups/1/2')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('message', 'The user is already in the group')
})

test('test delete group', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'test@hamza.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // create a new group
  await request(app)
    .post('/api/mygroups')
    .set('x-access-token', response.body.token)
    .send({ name: 'GroupDeleted' }) // Specify the name of the group
  expect(response.statusCode).toBe(200)

  // delete the group
  response = await request(app)
    .delete('/api/mygroups/3')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('message', 'Group deleted')
})

test('test delete member from group', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'test@hamza.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // delete the member from the group
  response = await request(app)
    .delete('/api/mygroups/1/2')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('message', 'Member removed')
})

test('delete again the member from group', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'test@hamza.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // delete the member from the group
  response = await request(app)
    .delete('/api/mygroups/1/2')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('message', 'The user is not in the group')
})

test('test get all groups', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'test@hamza.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // get all groups
  response = await request(app)
    .get('/api/groupsmember')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('message', 'Returning groups')
})

test('test verify group access', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'alice@test.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // get all members of groups
  response = await request(app)
    .get('/api/mygroups/1')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(403)
  expect(response.body).toHaveProperty('message', 'You are neither an admin, nor the owner or member')
})

test('test not admin in getGroups', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'alice@test.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // get all groups
  response = await request(app)
    .get('/api/mygroups')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('message', 'Returning groups')
})

test('test delete group not owner', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'just@member.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // delete the group
  response = await request(app)
    .delete('/api/mygroups/1')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(403)
  expect(response.body).toHaveProperty('message', 'You have to be the admin or the owner')
})

test('delete member not admin or owner', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'just@member.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // delete the member from the group
  response = await request(app)
    .delete('/api/mygroups/1/1')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(403)
  expect(response.body).toHaveProperty('message', 'You are not allowed to remove this member')
})

test('verifyGroup group not found', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'test@hamza.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // get all members of groups
  response = await request(app)
    .get('/api/mygroups/100')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(404)
  expect(response.body).toHaveProperty('message', 'Group not found')
})

test('verifyUser user not found', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'test@hamza.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // add a member to the group
  response = await request(app)
    .get('/api/mygroups/1/100')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('message', 'User not found')
})

test('name not specified in newGroup', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'test@hamza.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // create a new group
  response = await request(app)
    .post('/api/mygroups')
    .set('x-access-token', response.body.token)
    .send({}) // Empty request body
  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('message', 'You must specify the name of the group')
})

/* test à faire:
  11,27,57
*/
