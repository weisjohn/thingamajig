import 'babel-polyfill';
import _ from 'lodash';
import server from '../../src/server';
import models from '../../src/models';
import data from '../util/data';

const { Widget, Gadget, Func } = models;

describe('Gadget API', () => {
  before(async () => {
    await Widget.remove({});
    await chai
      .request(server)
      .post('/api/widget')
      .send(data.widget1);

    await chai
      .request(server)
      .post('/api/widget')
      .send(data.widget2);
  });

  describe('POST /api/gadget', () => {
    beforeEach(async () => {
      await Gadget.remove({});
    });

    ['name', 'widgets', 'functions'].forEach((field) => {
      it(`should fail if '${field}' not present`, (done) => {
        chai
          .request(server)
          .post('/api/gadget')
          .send(_.omit(data.gadget1, field))
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.equal(409);
            done();
          });
      });
    });

    it('should fail if widget is missing', (done) => {
      const gadgetX = _.cloneDeep(data.gadget1);
      gadgetX.widgets.push('missing');
      chai
        .request(server)
        .post('/api/gadget')
        .send(gadgetX)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(409);
          done();
        });
    });

    it('should deliver gadget resource if successful', (done) => {
      chai
        .request(server)
        .post('/api/gadget')
        .send(data.gadget1)
        .end((err, res) => {
          expect(err).not.to.exist;
          expect(res.status).to.equal(201);
          expect(res.body.success).to.be.true;
          expect(res.body.gadget).to.be.a('object');
          expect(res.body.gadget.id).to.be.a('string');
          expect(res.body.gadget.__v).not.to.exist;

          expect(res.body.gadget.name).to.equal('tailx');
          expect(res.body.gadget.widgets[0]).to.equal('rocket');
          expect(res.body.gadget.functions[0]).to.equal('sig');

          done();
        });
    });
  });
});
