process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHTTP = require('chai-http');
let should = chai.should();

chai.use(chaiHTTP);

describe('GET /URLs', () => {
  it('Should return status 200 on the URLs page', (done) => {
    chai.request('http://localhost:8080')
      .get(`/URLs`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('GET /URLs/new', () => {
  it('Should return the URLs page', (done) => {
    chai.request('http://localhost:8080')
      .get(`/URLs/new`)
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.exist;
        done();
      });
  });
});

