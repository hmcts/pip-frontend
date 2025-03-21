import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/blob-view-json?artefactId=123';

describe('Blob view JSON page', () => {
    describe('on GET', () => {
        test('should render blob view json page', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to blob view subscription resubmit confirmation page', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .post(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal(
                        'blob-view-subscription-resubmit-confirmation?artefactId=123'
                    );
                });
        });
    });
});
