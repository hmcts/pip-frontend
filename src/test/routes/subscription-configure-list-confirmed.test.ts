import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';

const PAGE_URL = '/subscription-configure-list-confirmed';

describe('Subscription Configure list confirmation should redirect when no user', () => {
    describe('on GET', () => {
        test('should render the sign in page due to being unauthorised to get to confirmation page', async () => {
            app.request['user'] = {};
            await request(app)
                .get(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.headers['location']).to.equal('/sign-in');
                });
        });
    });
});
