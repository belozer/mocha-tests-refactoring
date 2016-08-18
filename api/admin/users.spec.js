const supertest = require('supertest')
const expect = require('unexpected').clone()
  .installPlugin(require('unexpected-http'))

const serverUrl = 'http://localhost:3000'
const apiUrl = `${serverUrl}/api/v1`

describe('API v1.', function () {
  const server = supertest.agent(`${serverUrl}/api/v1`)
  let adminToken, testerToken

  before((done) => {
    server
    .post('/public/login')
    .send({uuid: 'belozy', password: 'test'})
    .end((err, res) => {
      if (err) { done(err) }
      adminToken = res.body.data.token

      server
      .post('/public/login')
      .send({uuid: 'tester', password: 'test4test'})
      .end((err, res) => {
        if (err) { done(err) }
        testerToken = res.body.data.token
        done()
      })
    })
  })

  describe('admin/users', () => {
    describe('# Creating user', () => {
      it('failure if mising auth token', () => {
        return expect({
          url: `POST ${apiUrl}/admin/users`,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            email: 'sergio@ua.ru',
            password: 'pass'
          }
        }, 'to yield response', {
          body: {
            success: false,
            msg: 'auth first'
          }
        })
      })

      it('success if token have role \'admin\'', () => {
        return expect({
          url: `POST ${apiUrl}/admin/users`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: {
            email: 'sergio@ua.ru',
            password: 'pass'
          }
        }, 'to yield response', {
          body: {
            success: true
          }
        })
      })

      it('failure if token have role \'user\'', () => {
        return expect({
          url: `POST ${apiUrl}/admin/users`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${testerToken}`
          },
          body: {
            email: 'sergio@ua.ru',
            password: 'pass'
          }
        }, 'to yield response', {
          body: {
            success: false,
            msg: 'allowed only admins'
          }
        })
      })

      it('failure if missing property \'password\'', () => {
        return expect({
          url: `POST ${apiUrl}/admin/users`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: {
            email: 'sergio4@ua.ru'
          }
        }, 'to yield response', {
          body: {
            success: false
          }
        })
      })

      it('success if properties have keys \'email\' and \'password\'', () => {
        return expect({
          url: `POST ${apiUrl}/admin/users`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: {
            email: 'sergio5@ua.ru',
            password: 'dsgsdg'
          }
        }, 'to yield response', {
          body: {
            success: true
          }
        })
      })

      it('failure if the email is already in the database', () => {
        return expect({
          url: `POST ${apiUrl}/admin/users`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: {
            email: 'test@test.ru',
            password: 'dsgsdg'
          }
        }, 'to yield response', {
          body: {
            success: false,
            msg: 'email already in the database'
          }
        })
      })

      it('failure if the phone number is already in the database', () => {
        return expect({
          url: `POST ${apiUrl}/admin/users`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: {
            phone: '9180000000',
            password: 'dsgsdg'
          }
        }, 'to yield response', {
          body: {
            success: false,
            msg: 'phone number already in the database'
          }
        })
      })

      it('failure if username is already in the database', () => {
        return expect({
          url: `POST ${apiUrl}/admin/users`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: {
            username: 'tester',
            password: 'dsgsdg'
          }
        }, 'to yield response', {
          body: {
            success: false,
            msg: 'username already in the database'
          }
        })
      })
    })
  })
})
