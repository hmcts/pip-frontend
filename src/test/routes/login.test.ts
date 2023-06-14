import request from 'supertest';
import { app } from '../../main/app';

describe('Login', () => {
    test('should redirect to the B2C login', async () => {
        await request(app)
            .get('/login')
            .expect(res => expect(res.redirect).toBeTruthy)
            .expect(res => expect(res.headers['location']).toContain('B2C_1_SignInUserFlow'));
    });

    test('should redirect to the Admin B2C login', async () => {
        await request(app)
            .get('/admin-login')
            .expect(res => expect(res.redirect).toBeTruthy)
            .expect(res => expect(res.headers['location']).toContain('B2C_1_SignInAdminUserFlow'));
    });

    test('should redirect to the Media Verification login', async () => {
        await request(app)
            .get('/media-verification')
            .expect(res => expect(res.redirect).toBeTruthy)
            .expect(res => expect(res.headers['location']).toContain('B2C_1_SignInMediaVerification'));
    });

    test('should redirect to the subscription management page on return', async () => {
        await request(app)
            .post('/login/return')
            .expect(res => expect(res.redirect).toBeTruthy());
    });

    test('should redirect to the admin dashboard page on return', async () => {
        await request(app)
            .post('/login/admin/return')
            .expect(res => expect(res.redirect).toBeTruthy());
    });
});
