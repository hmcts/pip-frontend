import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Search option', () => {
    describe('on GET', () => {
        test('should return search option page', async () => {
            await request(app)
                .get('/view-option')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('What do you want to do?');
                });
        });
    });

    describe('on POST', () => {
        test('should return search page', async () => {
            await request(app)
                .post('/view-option')
                .send({ 'view-choice': 'search' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('search');
                });
        });

        test('should return single justice procedure page', async () => {
            await request(app)
                .post('/view-option')
                .send({ 'view-choice': 'sjp' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('summary-of-publications?locationId=9');
                });
        });

        test('should return view option page if unknown option', async () => {
            await request(app)
                .post('/view-option')
                .send({ 'view-choice': 'unknown' })
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('What do you want to do?');
                });
        });
    });
});
