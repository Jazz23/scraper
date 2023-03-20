import chai from "chai"
import chaiHttp from "chai-http"
import express from "express"

import { helloHttp } from '../src/index'

const app = express()
app.get('/helloHttp', helloHttp)

chai.use(chaiHttp)
const expect = chai.expect

describe('helloHttp', () => {
    it('should give 200 with text "Hello World"', function (done) {
        chai.request(app)
            .get('/helloHttp')
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.text).to.be.equal('Hello World')
                expect(res).to.have.status(200)
                done()
            })
    })
})