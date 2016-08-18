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

  describe('user/data', () => {
    describe('# Getting user data', () => {
      it('success user data', () => {
        return expect({
          url: `GET ${apiUrl}/user/data`,
          headers: {
            Authorization: `Bearer ${testerToken}`
          }
        }, 'to yield response', {
          body: {
            success: true,
            data: expect.it('to have keys', [
              'id',
              'firstname',
              'lastname',
              'role'
            ])
          }
        })
      })
    })

    describe('# Update user data', () => {
      // after(() => {
      //   server
      //   .put('/user/data')
      //   .set('Authorization', `Bearer ${testerToken}`)
      //   .send({username: 'tester', password: 'test4test'})
      //   .end((err, res) => {
      //     if (err) { done(err) }
      //     done()
      //   })
      // })
      it('success update', () => {
        return expect({
          url: `PUT ${apiUrl}/user/data`,
          headers: {
            Authorization: `Bearer ${testerToken}`
          },
          body: {
            phone: 9140002233
          }
        }, 'to yield response', {
          body: {
            success: true
          }
        })
      })
    })
  })
})
