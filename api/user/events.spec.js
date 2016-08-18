const supertest = require('supertest')
const expect = require('unexpected').clone()
  .installPlugin(require('unexpected-http'))

const serverUrl = 'http://localhost:3000'
const apiUrl = `${serverUrl}/api/v1`

describe('API v1.', function () {
  const server = supertest.agent(`${serverUrl}/api/v1`)
  let testerToken

  before((done) => {
    server
    .post('/public/login')
    .send({uuid: 'tester', password: 'test4test'})
    .end((err, res) => {
      if (err) { done(err) }
      testerToken = res.body.data.token
      done()
    })
  })

  describe('user/events', () => {
    describe('# Getting events list for user', () => {
      it('success and return events array', () => {
        return expect({
          url: `GET ${apiUrl}/user/events`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${testerToken}`
          }
        }, 'to yield response', {
          body: {
            success: true,
            data: expect.it('to be an', 'array')
          }
        })
      })
    })
  })
})
