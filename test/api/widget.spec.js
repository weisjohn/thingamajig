import 'babel-polyfill';
import _ from 'lodash';
import server from '../../src/server';
import models from '../../src/models';
import data from '../util/data';

const { Widget } = models;

describe('Widget API', () => {
  before(async () => {
    await Widget.remove({});
  });

  describe('POST /api/widget', () => {
    beforeEach(async () => {
      await Widget.remove({});
    });

    ['name', 'parts'].forEach((field) => {
      it(`should fail if '${field}' not present`, (done) => {
        chai
          .request(server)
          .post('/api/widget')
          .send(_.omit(data.widget1, field))
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.equal(409);
            done();
          });
      });
    });

    it('should deliver widget resource if successful', (done) => {
      chai
        .request(server)
        .post('/api/widget')
        .send(data.widget1)
        .end((err, res) => {
          expect(err).not.to.exist;
          expect(res.status).to.equal(201);
          expect(res.body.success).to.be.true;
          expect(res.body.widget).to.be.a('object');
          expect(res.body.widget.id).to.be.a('string');
          expect(res.body.widget.__v).not.to.exist;

          expect(res.body.widget.name).to.equal('rocket');
          expect(res.body.widget.parts[0]).to.equal('spoke');
          expect(res.body.widget.parts[1]).to.equal('wheel');

          done();
        });
    });
  });
});
