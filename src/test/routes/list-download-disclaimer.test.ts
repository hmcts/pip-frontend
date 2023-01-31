import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/list-download-disclaimer?artefactId=123';
expressRequest['user'] = { roles: 'VERIFIED' };

describe('List download disclaimer', () => {
    describe('on GET', () => {
        test('should render list download disclaimer page', async () => {
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should render list download disclaimer page if no option is selected', async () => {
            await request(app)
                .post(PAGE_URL)
                .send({})
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect to list download files page if terms and conditions agreed', async () => {
            await request(app)
                .post(PAGE_URL)
                .send({ 'disclaimer-agreement': 'agree' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('list-download-files?artefactId=123');
                });
        });
    });
});
