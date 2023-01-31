import request from 'supertest';
import { app } from '../../main/app';

app.request['user'] = { userProvenance: 'PI_AAD' };

describe('Logout', () => {
    test('should redirect to the homepage', async () => {
        await request(app)
            .get('/logout')
            .expect(res => {
                expect(res.redirect).toBeTruthy;
                expect(res.header.location).toContain(encodeURIComponent('?lng=en'));
            });
    });
});

describe('Admin Logout', () => {
    test('should redirect to the admin login page', async () => {
        await request(app)
            .get('/logout')
            .expect(res => {
                expect(res.redirect).toBeTruthy;
                expect(res.header.location).toContain(encodeURIComponent('?lng=en'));
            });
    });
});
