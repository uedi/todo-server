const supertest = require('supertest')
const { sequelize } = require('../utils/db')
const app = require('../app')
const api = supertest(app)
const signupUrl = '/api/signup'

beforeEach(async () => {
    await sequelize.authenticate()
})

describe(`POST ${signupUrl}`, () => {
    test('returns 400 with improper data', async () => {
        await api
        .post(signupUrl)
        .send({})
        .expect(400)
    })
})

afterAll(async () => {
    await sequelize.close()
})