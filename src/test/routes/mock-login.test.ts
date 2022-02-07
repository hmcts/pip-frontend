import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';

describe('Mock login', () => {
  test('should redirect to subscription management after successful login', async () => {
    await request(app).post('/mock-login').send({id: '1', username: 'joe'})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/subscription-management');
      });
  });

  test('should redirect to not found page after unsuccessful login', async () => {
    await request(app).post('/mock-login').send({})
      .expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('/not-found');
      });
  });
});
