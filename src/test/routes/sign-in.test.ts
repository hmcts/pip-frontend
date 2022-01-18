import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

const options = ['hmcts', 'common', 'pi'];
const externalUrls = ['https://www.google.com','https://www.google.com','https://www.google.com'];

describe('Sign In option', () => {
  describe('on GET', () => {
    test('should return sign-in routing page', async () => {
      await request(app)
        .get('/sign-in')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  for (let i = 0; i < options.length; i++) {
    describe('on POST', () => {
      test('should redirect to external url when '+ options[i] +' is chosen', async () => {
        await request(app)
          .post('/sign-in')
          .send({'sign-in': options[i]})
          .expect((res) => {
            expect(res.status).to.equal(302);
            expect(res.header['location']).to.equal(externalUrls[i]);
          });
      });
    });
  }
});
