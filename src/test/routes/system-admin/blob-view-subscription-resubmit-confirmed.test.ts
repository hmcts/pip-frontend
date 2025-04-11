import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

describe('Blob view subscription re-submit confirmed page', () => {
    describe('on GET', () => {
        test('should render blob view subscription re-submit confirmed page', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .get('/blob-view-subscription-resubmit-confirmed')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
