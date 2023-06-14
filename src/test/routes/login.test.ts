import request from 'supertest';
import { app } from '../../main/app';

const mockRequestBody = { test: 'AADB2C90118' };

describe('Login', () => {
    beforeEach(() => {
        app.request['body'] = {};
    });

    test('should redirect to the B2C login in English', async () => {
        app.request['lng'] = 'en';

        await request(app)
            .get('/login?p=B2C_1_SignInUserFlow')
            .expect(res => expect(res.redirect).toBeTruthy)
            .expect(res => expect(res.headers['location']).toContain('b2c_1_signinuserflow'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=en'));
    });

    test('should redirect to the B2C login in Welsh', async () => {
        app.request['lng'] = 'cy';

        await request(app)
            .get('/login?p=B2C_1_SignInUserFlow')
            .expect(res => expect(res.redirect).toBeTruthy)
            .expect(res => expect(res.headers['location']).toContain('b2c_1_signinuserflow'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=cy-GB'));
    });

    test('should redirect to the Admin B2C login in English', async () => {
        app.request['lng'] = 'en';

        await request(app)
            .get('/admin-login?p=B2C_1_SignInAdminUserFlow')
            .expect(res => expect(res.redirect).toBeTruthy)
            .expect(res => expect(res.headers['location']).toContain('b2c_1_signinadminuserflow'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=en'));
    });

    test('should redirect to the Admin B2C login in Welsh', async () => {
        app.request['lng'] = 'cy';

        await request(app)
            .get('/admin-login?p=B2C_1_SignInAdminUserFlow')
            .expect(res => expect(res.redirect).toBeTruthy)
            .expect(res => expect(res.headers['location']).toContain('b2c_1_signinadminuserflow'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=cy-GB'));
    });

    test('should redirect to the Media Verification login in English', async () => {
        app.request['lng'] = 'en';

        await request(app)
            .get('/media-verification?p=B2C_1_SignInMediaVerification')
            .expect(res => expect(res.redirect).toBeTruthy)
            .expect(res => expect(res.headers['location']).toContain('b2c_1_signinmediaverification'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=en'));
    });

    test('should redirect to the Media Verification login in Welsh', async () => {
        app.request['lng'] = 'cy';

        await request(app)
            .get('/media-verification?p=B2C_1_SignInMediaVerification')
            .expect(res => expect(res.redirect).toBeTruthy)
            .expect(res => expect(res.headers['location']).toContain('b2c_1_signinmediaverification'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=cy-GB'));
    });

    test('should redirect to the login page in english on return', async () => {
        app.request['lng'] = 'en';

        await request(app)
            .post('/login/return?p=B2C_1_SignInUserFlow')
            .expect(res => expect(res.redirect).toBeTruthy())
            .expect(res => expect(res.headers['location']).toContain('b2c_1_signinuserflow'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=en'));
    });

    test('should redirect to the login page in welsh on return', async () => {
        app.request['lng'] = 'cy';

        await request(app)
            .post('/login/return?p=B2C_1_SignInUserFlow')
            .expect(res => expect(res.redirect).toBeTruthy())
            .expect(res => expect(res.headers['location']).toContain('b2c_1_signinuserflow'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=cy-GB'));
    });

    test('should redirect to the password reset in english on return', async () => {
        app.request['lng'] = 'en';
        app.request['body'] = mockRequestBody;

        await request(app)
            .post('/login/return?p=B2C_1_SignInUserFlow')
            .expect(res => expect(res.redirect).toBeTruthy())
            .expect(res => expect(res.headers['location']).toContain('B2C_1A_PASSWORD_RESET'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=en'));
    });

    test('should redirect to the password reset in welsh on return', async () => {
        app.request['lng'] = 'cy';
        app.request['body'] = mockRequestBody;

        await request(app)
            .post('/login/return?p=B2C_1_SignInUserFlow')
            .expect(res => expect(res.redirect).toBeTruthy())
            .expect(res => expect(res.headers['location']).toContain('B2C_1A_PASSWORD_RESET'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=cy-GB'));
    });

    test('should redirect to the admin login page in english on return', async () => {
        app.request['lng'] = 'en';

        await request(app)
            .post('/login/admin/return?p=B2C_1_SignInAdminUserFlow')
            .expect(res => expect(res.redirect).toBeTruthy())
            .expect(res => expect(res.headers['location']).toContain('b2c_1_signinadminuserflow'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=en'));
    });

    test('should redirect to the admin login page in welsh on return', async () => {
        app.request['lng'] = 'cy';

        await request(app)
            .post('/login/admin/return?p=B2C_1_SignInAdminUserFlow')
            .expect(res => expect(res.redirect).toBeTruthy())
            .expect(res => expect(res.headers['location']).toContain('b2c_1_signinadminuserflow'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=cy-GB'));
    });

    test('should redirect to the password reset page in english on return', async () => {
        app.request['lng'] = 'en';
        app.request['body'] = mockRequestBody;

        await request(app)
            .post('/login/admin/return?p=B2C_1_SignInAdminUserFlow')
            .expect(res => expect(res.redirect).toBeTruthy())
            .expect(res => expect(res.headers['location']).toContain('B2C_1A_PASSWORD_RESET'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=en'));
    });

    test('should redirect to the password reset page in welsh on return', async () => {
        app.request['lng'] = 'cy';
        app.request['body'] = mockRequestBody;

        await request(app)
            .post('/login/admin/return?p=B2C_1_SignInAdminUserFlow')
            .expect(res => expect(res.redirect).toBeTruthy())
            .expect(res => expect(res.headers['location']).toContain('B2C_1A_PASSWORD_RESET'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=cy-GB'));
    });

    test('should redirect to the media verification page in english on return', async () => {
        app.request['lng'] = 'en';

        await request(app)
            .post('/media-verification/return?p=B2C_1_SignInMediaVerification')
            .expect(res => expect(res.redirect).toBeTruthy())
            .expect(res => expect(res.headers['location']).toContain('b2c_1_signinmediaverification'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=en'));
    });

    test('should redirect to the media verification page in welsh on return', async () => {
        app.request['lng'] = 'cy';

        await request(app)
            .post('/media-verification/return?p=B2C_1_SignInMediaVerification')
            .expect(res => expect(res.redirect).toBeTruthy())
            .expect(res => expect(res.headers['location']).toContain('b2c_1_signinmediaverification'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=cy-GB'));
    });

    test('should redirect to the password reset page in english on return', async () => {
        app.request['lng'] = 'en';
        app.request['body'] = mockRequestBody;

        await request(app)
            .post('/media-verification/return?p=B2C_1_SignInMediaVerification')
            .expect(res => expect(res.redirect).toBeTruthy())
            .expect(res => expect(res.headers['location']).toContain('B2C_1A_PASSWORD_RESET'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=en'));
    });

    test('should redirect to the password reset page in welsh on return', async () => {
        app.request['lng'] = 'cy';
        app.request['body'] = mockRequestBody;

        await request(app)
            .post('/media-verification/return?p=B2C_1_SignInMediaVerification')
            .expect(res => expect(res.redirect).toBeTruthy())
            .expect(res => expect(res.headers['location']).toContain('B2C_1A_PASSWORD_RESET'))
            .expect(res => expect(res.headers['location']).toContain('ui_locales=cy-GB'));
    });
});
