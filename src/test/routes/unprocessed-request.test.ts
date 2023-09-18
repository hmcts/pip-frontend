import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

describe('Unprocessed request', () => {
    describe('on GET', () => {
        test('should return unprocessed request page', async () => {
            await request(app)
                .get('/unprocessed-request')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contain('Sorry, we were not able to process your request'));
        });
    });
});
