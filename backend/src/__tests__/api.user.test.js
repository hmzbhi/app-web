const app = require('../app')
const request = require('supertest')

test('Test if user can log in and list users', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
  response = await request(app)
    .get('/api/users')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('Returning users')
  expect(response.body.data.length).toBeGreaterThan(0)
})

test('Test if login endpoint fails without email', async () => {
  const response = await request(app)
    .post('/login')
    .send({ password: '123456' }) // Pas d'email fourni
  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('message', 'You must specify the email and password')
})

test('Test if user cannot log in with incorrect email', async () => {
  const response = await request(app)
    .post('/login')
    .send({ email: 'incorrect@email.com', password: '123456' })
  expect(response.statusCode).toBe(403)
  expect(response.body).toHaveProperty('status', false)
  expect(response.body).toHaveProperty('message', 'Wrong email/password')
})

test('Test if getUsers endpoint fails without token', async () => {
  const response = await request(app)
    .get('/api/users')
  expect(response.statusCode).toBe(403)
  expect(response.body).toHaveProperty('message', 'Token missing')
})

test('Test if getUsers endpoint fails with incorrect token (in syntax)', async () => {
  const response = await request(app)
    .get('/api/users')
    .set('x-access-token', 'incorrecttoken')
  expect(response.statusCode).toBe(400) // Mettez à jour le code d'état attendu
  expect(response.body).toHaveProperty('message', 'The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received undefined')
})

test('Test if getUsers endpoint fails with incorrect token (in value)', async () => {
  const response = await request(app)
    .get('/api/users')
    .set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.aGFtemFAZ21haWwuY29t.fFdbgQfAeqrtY1LKrQD_VeYoP04AbjlaFlfZPiF0zugdgs')
  expect(response.statusCode).toBe(403) // Mettez à jour le code d'état attendu
  expect(response.body).toHaveProperty('message', 'Token invalid')
})

test('Test if newUser endpoint fails without name', async () => {
  const response = await request(app)
    .post('/register')
    .send({ email: 'John.Doe@acme.com', password: '1m02P@SsF0rt!' }) // Pas de nom fourni
  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('message', 'You must specify the name and email')
})

test('Test if newUser endpoint fails without password', async () => {
  const response = await request(app)
    .post('/register')
    .send({ name: 'John Doe', email: 'John.Doe@acme.com' }) // Pas de mot de passe fourni
  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('message', 'You must specify the name and email')
})

test('Test if newUser endpoint succeeds with valid data', async () => {
  const response = await request(app)
    .post('/register')
    .send({ name: 'John Doe', email: 'John.Doe@acme.com', password: '1m02P@SsF0rt!' }) // Données valides
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('status', true)
  expect(response.body).toHaveProperty('message', 'User Added')
})

test('Test if newUser endpoint fails with weak password', async () => {
  const response = await request(app)
    .post('/register')
    .send({ name: 'John Doe', email: 'John.Doe@acme.com', password: '1234567' }) // Mot de passe faible
  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('message', 'Weak password!')
})

test('Test if newUser endpoint fails with existing email', async () => {
  await request(app)
    .post('/register')
    .send({ name: 'Jane Smith', email: 'jane.smith@example.com', password: '1m02P@SsF0rt!' })
  // Maintenant, essayez de créer un compte avec la même adresse e-mail
  const response = await request(app)
    .post('/register')
    .send({ name: 'John Doe', email: 'jane.smith@example.com', password: '1m02P@SsF0rt!1' })
  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('message', 'Validation error')
})

test('Test if user can update password & login if it is active', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
  // Update password with the obtained token
  response = await request(app)
    .put('/api/password')
    .set('x-access-token', response.body.token)
    .send({ password: '1m02P@SsF0rt!1' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('status', true)
  expect(response.body).toHaveProperty('message', 'Password updated')
  // Attempt login with new password
  response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '1m02P@SsF0rt!1' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
})

test('Test if only admin can delete users', async () => {
  // Create a non-admin user
  await request(app)
    .post('/register')
    .send({ name: 'Normal User', email: 'normal.user@example.com', password: '1m02P@SsF0rt!12' })

  // Login as a non-admin user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'normal.user@example.com', password: '1m02P@SsF0rt!12' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // Attempt to delete user with obtained token
  response = await request(app)
    .delete('/api/users/3') // Assuming 3 is the ID of the user you want to delete
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(403) // Expected to fail due to lack of admin privileges
  expect(response.body).toHaveProperty('message', 'Forbidden')
})

test('Test if admin can update users', async () => {
  // Login as admin (Sebastien Viardot) to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '1m02P@SsF0rt!1' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // Attempt to update user with obtained token
  response = await request(app)
    .put('/api/users/1') // Assuming 1 is the ID of the user you want to update
    .set('x-access-token', response.body.token)
    .send({ name: 'Updated Name' }) // Sending updated data
  expect(response.statusCode).toBe(200) // Expected to succeed as admin
  expect(response.body).toHaveProperty('message', 'User updated')
})

test('Test if update password endpoint fails without password', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'normal.user@example.com', password: '1m02P@SsF0rt!12' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // Attempt to update password without providing new password
  response = await request(app)
    .put('/api/password')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('message', 'You must specify the password')
})

test('Test if update password endpoint fails with weak password', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'normal.user@example.com', password: '1m02P@SsF0rt!12' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // Attempt to update password with weak password
  response = await request(app)
    .put('/api/password')
    .set('x-access-token', response.body.token)
    .send({ password: 'weak' }) // Weak password
  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('message', 'Weak password!')
})

test('Endpoints not found', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'normal.user@example.com', password: '1m02P@SsF0rt!12' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // Attempt to update password without providing new password
  response = await request(app)
    .get('/soljhgdosd')
  expect(response.statusCode).toBe(404)
  expect(response.body).toHaveProperty('message', 'Endpoint Not Found')
})

test('Test if updateUser endpoint fails without required fields', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '1m02P@SsF0rt!1' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // Attempt to update user without providing required fields
  response = await request(app)
    .put('/api/users/1') // Assuming 1 is the ID of the user you want to update
    .set('x-access-token', response.body.token)
    .send({}) // Empty request body
  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('message', 'You must specify the name, email or password')
})

test('Test if deleteUser endpoint fails without specifying user ID', async () => {
  // Login with existing user to get token
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '1m02P@SsF0rt!1' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // Attempt to delete user without specifying user ID
  response = await request(app)
    .delete('/api/users/ ') // Assuming no user ID is provided
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(400)
  expect(response.body).toHaveProperty('message', 'You must specify the id')
})

test('Test if admin can delete users', async () => {
  // obtain token beafor delete user
  let response = await request(app)
    .post('/login')
    .send({ email: 'John.Doe@acme.com', password: '1m02P@SsF0rt!' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  const token = response.body.token

  response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '1m02P@SsF0rt!1' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  // Attempt to delete user with obtained token
  response = await request(app)
    .delete('/api/users/5') // Assuming 5 is the ID of the user you want to delete
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(200) // Expected to succeed as admin
  expect(response.body).toHaveProperty('message', 'User deleted')

  // Attempt to delete user with obtained token
  response = await request(app)
    .get('/api/users')
    .set('x-access-token', token)
})

test('Test update password user ok', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '1m02P@SsF0rt!1' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')

  response = await request(app)
    .put('/api/users/2')
    .set('x-access-token', response.body.token)
    .send({ password: '1m02P@SsF0rt!4' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('status', true)
  expect(response.body).toHaveProperty('message', 'User updated')
})

test('login with password false', async () => {
  const response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '1m02P@SsF0rt!1' })
  expect(response.statusCode).toBe(403)
  expect(response.body).toHaveProperty('status', false)
  expect(response.body).toHaveProperty('message', 'Wrong email/password')
})
