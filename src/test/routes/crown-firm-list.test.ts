import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

describe('Crown Firm List Page', () => {
    describe('on GET', () => {
        test('should return crown firm list page', async () => {
            await request(app)
                .get('/crown-firm-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
