import chai from "chai"
import chaiHttp from "chai-http"
import express from "express"
import bodyParser from "body-parser"

import { helloHttp } from '../src/index'

const app = express()
app.use(bodyParser.json());
app.post('/helloHttp', helloHttp)

chai.use(chaiHttp)
const expect = chai.expect

describe('helloHttp', () => {
    it('query selector 200', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            cssQuerySelector: '#rso > div:nth-child(4) > div > div > div.Z26q7c.UK95Uc.jGGQ5e > div > a > h3'
        }
        chai.request(app)
            .post('/helloHttp')
            .send(config)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.text).to.be.equal('Match found! Webhook sent.')
                expect(res).to.have.status(200)
                done()
            })
    }),
    it('plain text 200', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            plainText: 'Test.com: Home'
        }
        chai.request(app)
            .post('/helloHttp')
            .send(config)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.text).to.be.equal('Match found! Webhook sent.')
                expect(res).to.have.status(200)
                done()
            })
    }),
    it('regex test 200', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            regexPattern: 'Test\\.com.{6}</h3>'
        }
        chai.request(app)
            .post('/helloHttp')
            .send(config)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.text).to.be.equal('Match found! Webhook sent.')
                expect(res).to.have.status(200)
                done()
            })
    }),
    it('query selector with text match 200', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            cssQuerySelector: '#rso > div:nth-child(4) > div > div > div.Z26q7c.UK95Uc.jGGQ5e > div > a > h3',
            matchedText: 'Test.com: Home'
        }
        chai.request(app)
            .post('/helloHttp')
            .send(config)
            .end((err, res) => {
                expect(res).to.have.status(200)
                done()
            })
    }),
    it('regex test with text 200', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            regexPattern: 'Test\\.com.{6}</h3>',
            matchedText: 'Test.com: Home</h3>'
        }
        chai.request(app)
            .post('/helloHttp')
            .send(config)
            .end((err, res) => {
                expect(res).to.have.status(200)
                done()
            })
    }),
    it('query selector with text match 404', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            cssQuerySelector: '#rso > div:nth-child(4) > div > div > div.Z26q7c.UK95Uc.jGGQ5e > div > a > h3',
            text: 'ooggie boogie'
        }
        chai.request(app)
            .post('/helloHttp')
            .send(config)
            .end((err, res) => {
                expect(res).to.have.status(404)
                done()
            })
    }),
    it('plain text 404', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            plainText: 'ooggie boogie'
        }
        chai.request(app)
            .post('/helloHttp')
            .send(config)
            .end((err, res) => {
                expect(res).to.have.status(404)
                console.log(res.body)
                done()
            })
    }),
    it('regex test 404', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            regexPattern: 'bruh\\.com.{6}</h3>'
        }
        chai.request(app)
            .post('/helloHttp')
            .send(config)
            .end((err, res) => {
                expect(res).to.have.status(404)
                done()
            })
    }),
    it('400 test, multiple search params', function (done) {
        const badConfig = {
            url: 'https://www.google.com',
            cssQuerySelector: 'a',
            regexPattern: 'a'
        }
        chai.request(app)
            .post('/helloHttp')
            .send(badConfig)
            .end((err, res) => {
                expect(res).to.have.status(400)
                done()
            })
    }),
    it('400, plainText and matchedText', function (done) {
        const badConfig = {
            url: 'https://www.google.com',
            matchedText: 'a',
            plainText: 'a'
        }
        chai.request(app)
            .post('/helloHttp')
            .send(badConfig)
            .end((err, res) => {
                expect(res).to.have.status(400)
                done()
            })
    }),
    it('400, bad url', function (done) {
        const badConfig = {
            url: 'deez nuts',
            plainText: 'a'
        }
        chai.request(app)
            .post('/helloHttp')
            .send(badConfig)
            .end((err, res) => {
                expect(res).to.have.status(400)
                done()
            })
    })
})