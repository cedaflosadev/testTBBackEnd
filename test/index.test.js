const assert = require('chai').assert
const index = require('../index')

const indexTest = index.validateServerRun()

describe('Index Suite', function () { // eslint-disable-line no-use-before-define
  it('Run server ', function () { // eslint-disable-line no-use-before-define
    assert.equal(indexTest, `Servidor corriendo en puerto ${process.env.PORT}`)
  })
})
