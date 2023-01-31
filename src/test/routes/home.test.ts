import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';

describe('Home page', () => {
    test('should render a page', async () => {
        await request(app)
            .get('/')
            .expect(res => expect(res.status).to.equal(200));
    });

    test('should render a page with a language change to English', async () => {
        await request(app)
            .get('/?lng=en')
            .expect(res => expect(res.status).to.equal(200));
    });

    test('should render a page with a language change to Welsh', async () => {
        await request(app)
            .get('/?lng=cy')
            .expect(res => expect(res.status).to.equal(200));
    });
});
