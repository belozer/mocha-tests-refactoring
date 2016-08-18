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

  describe('user/objects', () => {
    describe('# Getting objects', () => {
      it('failure if missing auth token', () => {
        return expect({
          url: `GET ${apiUrl}/user/objects`
        }, 'to yield response', {
          body: {
            success: false
          }
        })
      })

      it('success and return 3 objects for user \'tester\'', () => {
        return expect({
          url: `GET ${apiUrl}/user/objects`,
          headers: {
            Authorization: `Bearer ${testerToken}`
          }
        }, 'to yield response', {
          body: {
            success: true,
            data: expect.it('to have length', 10)
          }
        })
      })
    })
  })
})
