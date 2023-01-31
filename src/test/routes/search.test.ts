import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

describe('Search', () => {
    describe('on GET', () => {
        test('should return search option page', async () => {
            await request(app)
                .get('/search')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
