const assert = require('chai').assert
const expect = require('chai').expect
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

describe('File Suite', function () {
  it('File response 200', function (done) {
    chai.request(process.env.URL_BASE)
      .get('files/data')
      .end(function (err,res) {
        if(err) console.log(err)
        expect(res).to.have.status(200)
        done()
      })
  })

  it('Type of request all files', function (done) {
    chai.request(process.env.URL_BASE)
      .get('files/data')
      .end(function (err,res) {
        if(err) console.log(err)
        assert.typeOf(res.body, 'array')
        done()
      })
  })

  it('Response 200 file list avaibles', function (done) {
    chai.request(process.env.URL_BASE)
      .get('files/list')
      .end(function (err,res) {
        if(err) console.log(err)
        expect(res).to.have.status(200)
        done()
      })
  })
  it('Type of request all list avaibles', function (done) {
    chai.request(process.env.URL_BASE)
      .get('files/list')
      .end(function (err,res) {
        if(err) console.log(err)
        assert.typeOf([res.body], 'array')
        done()
      })
  })
})
