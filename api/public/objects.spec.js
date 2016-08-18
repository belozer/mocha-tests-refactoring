const expect = require('unexpected').clone()
  .installPlugin(require('unexpected-http'))

const serverUrl = 'http://localhost:3000'
const apiUrl = `${serverUrl}/api/v1`

describe('API v1.', function () {
  describe('public/objects', () => {
    describe('# Activation objects', () => {
      it('failure if missing property \'customer_code\'', () => {
        return expect({
          url: `POST ${apiUrl}/public/objects`,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            object_code: 'object_111',
            object_type: 'incubator'
          }
        }, 'to yield response', {
          body: {
            success: false,
            msg: '\'customer_code\' is required'
          }
        })
      })

      it('failure if missing property \'object_code\'', () => {
        return expect({
          url: `POST ${apiUrl}/public/objects`,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            customer_code: 'zoomir',
            object_type: 'incubator'
          }
        }, 'to yield response', {
          body: {
            success: false,
            msg: '\'object_code\' is required'
          }
        })
      })

      it('failure if missing property \'object_type\'', () => {
        return expect({
          url: `POST ${apiUrl}/public/objects`,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            customer_code: 'zoomir',
            object_code: '1992421434'
          }
        }, 'to yield response', {
          body: {
            success: false,
            msg: '\'object_type\' is required'
          }
        })
      })

      it('failure if \'customer_code\' not found in system', () => {
        return expect({
          url: `POST ${apiUrl}/public/objects`,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            customer_code: 'ooozoomooodoo',
            object_code: 'fsafs',
            object_type: 'henhouse'
          }
        }, 'to yield response', {
          body: {
            success: false,
            msg: '\'customer_code\' not found'
          }
        })
      })

      it('success if properties have keys: customer_code, object_type and object_code', () => {
        return expect({
          url: `POST ${apiUrl}/public/objects`,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            customer_code: 'zoomir',
            object_code: '1122334455',
            object_type: 'incubator'
          }
        }, 'to yield response', {
          body: {
            success: true,
            status: 'added',
            data: expect.it('to have properties', ['ouid', 'type', 'created_at'])
          }
        })
      })

      it('return \'duplicate\' if object already added', () => {
        return expect({
          url: `POST ${apiUrl}/public/objects`,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            customer_code: 'zoomir',
            object_code: '1122334455',
            object_type: 'incubator'
          }
        }, 'to yield response', {
          body: {
            success: true,
            status: 'duplicate',
            data: expect.it('to have properties', ['ouid', 'type', 'created_at'])
          }
        })
      })
    })

    describe('# Send invite for user', () => {
      const ouid = '3e8a6ab1d0e7ed98ef5fad10d14ba41e'
      const uuid = '9180000000'
      const fakeUuid = '9005555555'

      it('success if user is in the database', () => {
        return expect({
          url: `POST ${apiUrl}/public/objects/${ouid}/users/${uuid}`,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            action: 'invite'
          }
        }, 'to yield response', {
          body: {
            success: true
          }
        })
      })

      it('failure if user is not in the database', () => {
        return expect({
          url: `POST ${apiUrl}/public/objects/${ouid}/users/${fakeUuid}`,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            action: 'invite'
          }
        }, 'to yield response', {
          body: {
            success: false,
            msg: 'user not found'
          }
        })
      })
    })

    describe('# Send metrics to the object', () => {
      const ouid = '3e8a6ab1d0e7ed98ef5fad10d14ba41e'

      it('failure if missing \'metrics\'', () => {
        return expect({
          url: `POST ${apiUrl}/public/objects/${ouid}/metrics`,
          body: {
            timestamp: '2016-06-20 02:17:25+02'
          }
        }, 'to yield response', {
          body: {
            success: false,
            msg: 'missing property \'metrics\''
          }
        })
      })

      it('failure if missing \'timestamp\'', () => {
        return expect({
          url: `POST ${apiUrl}/public/objects/${ouid}/metrics`,
          body: {
            metrics: {
              'param_1': 13,
              'param_2': 43,
              'param_3': [100, 20, 3, 41]
            }
          }
        }, 'to yield response', {
          body: {
            success: false,
            msg: 'missing property \'timestamp\''
          }
        })
      })

      it('success if metrics and timestamp included', () => {
        return expect({
          url: `POST ${apiUrl}/public/objects/${ouid}/metrics`,
          body: {
            metrics: {
              'param_1': 13,
              'param_2': 43,
              'param_3': [100, 20, 3, 41]
            },
            timestamp: '2016-06-20 02:17:25+02'
          }
        }, 'to yield response', {
          body: {
            success: true,
            status: 'added',
            timestamp: '2016-06-20 02:17:25+02'
          }
        })
      })

      it('failure if the package is already saved', () => {
        return expect({
          url: `POST ${apiUrl}/public/objects/${ouid}/metrics`,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            metrics: {
              'param_1': 13,
              'param_2': 43,
              'param_3': [100, 20, 3, 41]
            },
            timestamp: '2016-06-20 02:17:25+02'
          }
        }, 'to yield response', {
          body: {
            success: true,
            status: 'dublicate',
            timestamp: '2016-06-20 02:17:25+02'
          }
        })
      })
    })
  })
})
