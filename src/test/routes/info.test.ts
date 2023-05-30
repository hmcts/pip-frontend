import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';

describe('Info', () => {
    test('should render info page', async () => {
        await request(app)
            .get('/info')
            .expect(res => expect(res.status).to.equal(200));
    });
});
