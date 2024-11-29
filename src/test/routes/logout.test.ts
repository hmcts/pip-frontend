import request from 'supertest';
import { app } from '../../main/app';

describe('Logout', () => {
    test('should redirect to the homepage', async () => {
        app.request['user'] = { userProvenance: 'PI_AAD' };
        await request(app)
            .get('/logout')
            .expect(res => {
                expect(res.redirect).toBeTruthy;
                expect(res.header.location).toContain(encodeURIComponent('?lng=en'));
            });
    });
});

describe('B2C admin Logout', () => {
    test('should redirect to the admin login page', async () => {
        app.request['user'] = { userProvenance: 'PI_AAD' };
        await request(app)
            .get('/logout')
            .expect(res => {
                expect(res.redirect).toBeTruthy;
                expect(res.header.location).toContain(encodeURIComponent('?lng=en'));
            });
    });
});

describe('SSO admin Logout', () => {
    test('should redirect to the admin login page', async () => {
        app.request['user'] = { userProvenance: 'SSO' };
        await request(app)
            .get('/logout')
            .expect(res => {
                expect(res.redirect).toBeTruthy;
                expect(res.header.location).toContain(encodeURIComponent('?lng=en'));
            });
    });
});
