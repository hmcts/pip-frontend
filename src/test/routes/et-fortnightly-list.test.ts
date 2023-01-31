import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

describe('ET Fortnightly List Page', () => {
    describe('on GET', () => {
        test('should return ET Fortnightly list page', async () => {
            await request(app)
                .get('/et-fortnightly-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
