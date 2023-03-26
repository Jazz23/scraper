import chai from "chai"
import chaiHttp from "chai-http"
import express from "express"
import bodyParser from "body-parser"
import * as fs from 'fs';

import { checker } from '../src/index'

const app = express()
app.use(bodyParser.json());
app.post('/checker', checker)
app.get('/checker', checker)

chai.use(chaiHttp)
const expect = chai.expect

describe('run', () => {
    it('run server', function (done) {
        this.timeout(-1)
        app.listen(8080);
    })
})

describe('checker', () => {
    it('query selector 200', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            cssQuerySelector: '#rso > div:nth-child(5) > div > div > div.Z26q7c.UK95Uc.jGGQ5e > div > a > h3'
        }
        chai.request(app)
            .post('/checker')
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
            .post('/checker')
            .send(config)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.text).to.be.equal('Match found! Webhook sent.')
                expect(res).to.have.status(200)
                done()
            })
    }),
    it('plain text 200 only visible', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            plainText: 'Test.com: Home',
            onlyVisibleText: true
        }
        chai.request(app)
            .post('/checker')
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
            .post('/checker')
            .send(config)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.text).to.be.equal('Match found! Webhook sent.')
                expect(res).to.have.status(200)
                done()
            })
    }),
    it('regex test 404 only visible', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            regexPattern: 'Test\\.com.{6}</h3>',
            onlyVisibleText: true
        }
        chai.request(app)
            .post('/checker')
            .send(config)
            .end((err, res) => {
                expect(res).to.have.status(404)
                done()
            })
    }),
    it('query selector with text match 200', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            cssQuerySelector: '#rso > div:nth-child(5) > div > div > div.Z26q7c.UK95Uc.jGGQ5e > div > a > h3',
            matchedText: 'Test.com: Home'
        }
        chai.request(app)
            .post('/checker')
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
            .post('/checker')
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
            matchedText: 'ooggie boogie'
        }
        chai.request(app)
            .post('/checker')
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
            .post('/checker')
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
            .post('/checker')
            .send(config)
            .end((err, res) => {
                expect(res).to.have.status(404)
                console.log(res.text)
                done()
            })
    }),
    it('regex test 404 with bad matched text', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            regexPattern: 'Test\\.com.{6}</h3>',
            matchedText: 'bruh.com: Home</h3>'
        }
        chai.request(app)
            .post('/checker')
            .send(config)
            .end((err, res) => {
                expect(res).to.have.status(404)
                console.log(res.text)
                done()
            })
    }),
    it('plain text 404 because only visible', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            plainText: '</head>',
            onlyVisibleText: true
        }
        chai.request(app)
            .post('/checker')
            .send(config)
            .end((err, res) => {
                expect(res).to.have.status(404)
                console.log(res.text)
                done()
            })
    }),
    it('plain text 200 because not only visible', function (done) {
        const config = {
            url: 'https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8',
            plainText: '</head>'
        }
        chai.request(app)
            .post('/checker')
            .send(config)
            .end((err, res) => {
                expect(res).to.have.status(200)
                console.log(res.text)
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
            .post('/checker')
            .send(badConfig)
            .end((err, res) => {
                expect(res).to.have.status(400)
                console.log(res.text)
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
            .post('/checker')
            .send(badConfig)
            .end((err, res) => {
                expect(res).to.have.status(400)
                console.log(res.text)
                done()
            })
    }),
    it('400, bad url', function (done) {
        const badConfig = {
            url: 'deez nuts',
            plainText: 'a'
        }
        chai.request(app)
            .post('/checker')
            .send(badConfig)
            .end((err, res) => {
                expect(res).to.have.status(400)
                console.log(res.text)
                done()
            })
    }),
    it('400, no matcher specified', function (done) {
        const badConfig = {
            url: 'https://google.com'
        }
        chai.request(app)
            .post('/checker')
            .send(badConfig)
            .end((err, res) => {
                expect(res).to.have.status(400)
                console.log(res.text)
                done()
            })
    }),
    it('400, cant have only visible and query selector', function (done) {
        const badConfig = {
            url: 'https://google.com',
            onlyVisibleText: true,
            cssQuerySelector: 'a'
        }
        chai.request(app)
            .post('/checker')
            .send(badConfig)
            .end((err, res) => {
                expect(res).to.have.status(400)
                console.log(res.text)
                done()
            })
    }),
    it('waitlist', function (done) {
        const badConfig = {
            url: 'https://pisa.ucsc.edu/class_search/index.php?action=detail&class_data=YToyOntzOjU6IjpTVFJNIjtzOjQ6IjIyMzIiO3M6MTA6IjpDTEFTU19OQlIiO3M6NToiNTEyMDkiO30%253D',
            plainText: 'Closed with Wait List'
        }
        chai.request(app)
            .post('/checker')
            .send(badConfig)
            .end((err, res) => {
                expect(res).to.have.status(200)
                console.log(res.text)
                done()
            })
    }),
    it('waitlist 404', function (done) {
        const badConfig = {
            url: 'https://pisa.ucsc.edu/class_search/index.php?action=detail&class_data=YToyOntzOjU6IjpTVFJNIjtzOjQ6IjIyMzIiO3M6MTA6IjpDTEFTU19OQlIiO3M6NToiNTAxMDYiO30%253D',
            plainText: 'Closed with Wait List'
        }
        chai.request(app)
            .post('/checker')
            .send(badConfig)
            .end((err, res) => {
                expect(res).to.have.status(404)
                console.log(res.text)
                done()
            })
    }),
    it('get', function (done) {
        chai.request(app)
            .get('/checker')
            .query('url=https://www.google.com/search?q=test&oq=test&aqs=chrome..69i57j69i59l2j69i60l2j69i61j69i65l2.376j0j7&sourceid=chrome&ie=UTF-8')
            .end((err, res) => {
                fs.writeFileSync('test.html', res.text)
                done()
            })
    })
})