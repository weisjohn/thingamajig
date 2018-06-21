import 'babel-polyfill';
import _ from 'lodash';
import server from '../../src/server';
import models from '../../src/models';
import data from '../util/data';

const { Widget, Gadget, Func } = models;

describe('Function API', () => {
  before(async () => {
    await Widget.remove({});
    await Gadget.remove({});

    // populate the widgets and gadgets via the api
    await chai
      .request(server)
      .post('/api/widget')
      .send(data.widget1);

    await chai
      .request(server)
      .post('/api/widget')
      .send(data.widget2);

    await chai
      .request(server)
      .post('/api/gadget')
      .send(data.gadget1);

    await chai
      .request(server)
      .post('/api/gadget')
      .send(data.gadget2);
  });

  describe('POST /api/function', () => {
    beforeEach(async () => {
      await Func.remove({});
    });

    ['name', 'gadget'].forEach((field) => {
      it(`should fail if '${field}' not present`, (done) => {
        chai
          .request(server)
          .post('/api/function')
          .send(_.omit(data.function1, field))
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.equal(409);
            done();
          });
      });
    });

    it('should fail if function is missing', (done) => {
      const functionX = _.cloneDeep(data.function1);
      functionX.name = 'missing';
      chai
        .request(server)
        .post('/api/function')
        .send(functionX)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(409);
          done();
        });
    });

    it('should fail if function unsupported by gadget', (done) => {
      const functionX = _.cloneDeep(data.function1);
      functionX.name = 'hash';
      chai
        .request(server)
        .post('/api/function')
        .send(functionX)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(409);
          done();
        });
    });

    it('should deliver function resource if successful', (done) => {
      chai
        .request(server)
        .post('/api/function')
        .send(data.function1)
        .end((err, res) => {
          expect(err).not.to.exist;
          expect(res.status).to.equal(201);
          expect(res.body.success).to.be.true;
          expect(res.body.function).to.be.a('object');
          expect(res.body.function.id).to.be.a('string');

          expect(res.body.function.name).to.equal('sig');
          expect(res.body.function.gadget).to.equal('tailx');
          expect(res.body.function.uuid).to.match(/[\w]{8}(-[\w]{4}){3}-[\w]{12}/);
          const start = new Date(res.body.function.start);
          expect(start.toString()).to.not.equal('Invalid Date');

          done();
        });
    });
  });

  describe('GET /api/function', () => {
    let func1;
    let func2;
    beforeEach(async () => {
      await Func.remove({});
      const res1 = await chai
        .request(server)
        .post('/api/function')
        .send(data.function1);
      func1 = res1.body.function;

      const res2 = await chai
        .request(server)
        .post('/api/function')
        .send(data.function2);
      func2 = res2.body.function;
    });

    it('should return a function execution for an signature', (done) => {
      chai
        .request(server)
        .get(`/api/function/${func1.uuid}`)
        .send(data.function1)
        .end((err, res) => {
          expect(err).not.to.exist;
          expect(res.status).to.equal(200);
          expect(res.body.success).to.be.true;
          expect(res.body.function).to.be.a('object');
          expect(res.body.function.id).to.be.a('string');

          expect(res.body.function.uuid).to.equal(func1.uuid);
          expect(res.body.function.output).to.equal(data.sig);

          done();
        });
    });

    it('should return a function execution for a hash', (done) => {
      chai
        .request(server)
        .get(`/api/function/${func2.uuid}`)
        .send(data.function2)
        .end((err, res) => {
          expect(err).not.to.exist;
          expect(res.status).to.equal(200);
          expect(res.body.success).to.be.true;
          expect(res.body.function).to.be.a('object');
          expect(res.body.function.id).to.be.a('string');

          expect(res.body.function.uuid).to.equal(func2.uuid);
          expect(res.body.function.output).to.equal(data.hash);

          done();
        });
    });
  });
});
