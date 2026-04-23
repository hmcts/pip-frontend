import request from 'supertest';
import express from 'express';

describe('/manage-third-party-subscriber-status routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        // Mock
        const isPermittedSystemAdmin = (_req, _res, next) => next();

        // Mock
        const manageThirdPartySubscriberStatusController = {
            get: (req, res) => res.status(200).send('GET OK'),
            post: (req, res) => res.status(302).redirect('/manage-third-party-subscriber-status-success'),
        };

        app.get(
            '/manage-third-party-subscriber-status',
            isPermittedSystemAdmin,
            manageThirdPartySubscriberStatusController.get
        );
        app.post(
            '/manage-third-party-subscriber-status',
            isPermittedSystemAdmin,
            manageThirdPartySubscriberStatusController.post
        );
    });

    it('GET /manage-third-party-subscriber-status should return 200', async () => {
        const res = await request(app).get('/manage-third-party-subscriber-status');
        expect(res.status).toBe(200);
        expect(res.text).toBe('GET OK');
    });

    it('POST /manage-third-party-subscriber-status should redirect to success', async () => {
        const res = await request(app)
            .post('/manage-third-party-subscriber-status')
            .send({ userId: '123', status: 'Active' });
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe('/manage-third-party-subscriber-status-success');
    });
});
