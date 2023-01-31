import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

describe('ET Daily List Page', () => {
    describe('on GET', () => {
        test('should return ET daily list page', async () => {
            await request(app)
                .get('/et-daily-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
