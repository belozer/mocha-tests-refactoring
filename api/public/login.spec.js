const expect = require('unexpected').clone()
  .installPlugin(require('unexpected-http'))

const serverUrl = 'http://localhost:3000'
const apiUrl = `${serverUrl}/api/v1`

describe('API v1.', function () {
  describe('public/login', () => {
    it('success if uuid is email', () => {
      return expect({
        url: `POST ${apiUrl}/public/login`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          uuid: 'test@test.ru',
          password: 'test4test'
        }
      }, 'to yield response', {
        body: {
          success: true,
          data: {
            token: expect.it('to be a', 'string')
          }
        }
      })
    })

    it('success if uuid is phone', () => {
      return expect({
        url: `POST ${apiUrl}/public/login`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          uuid: '9180000000',
          password: 'test4test'
        }
      }, 'to yield response', {
        body: {
          success: true,
          data: {
            token: expect.it('to be a', 'string')
          }
        }
      })
    })

    it('success if uuid is username', () => {
      return expect({
        url: `POST ${apiUrl}/public/login`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          uuid: 'tester',
          password: 'test4test'
        }
      }, 'to yield response', {
        body: {
          success: true,
          data: {
            token: expect.it('to be a', 'string')
          }
        }
      })
    })
  })
})
