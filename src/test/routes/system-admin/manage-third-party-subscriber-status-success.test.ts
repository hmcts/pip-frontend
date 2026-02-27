import request from 'supertest';
import express from 'express';

describe('/manage-third-party-subscriber-status-success route', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());

        // Mock
        const isPermittedSystemAdmin = (_req, _res, next) => next();

        // Mock
        const manageThirdPartySubscriberStatusSuccessController = {
            get: (_req, res) => res.status(200).send('Rendered manage-third-party-subscriber-status-success'),
        };

        app.get(
            '/manage-third-party-subscriber-status-success',
            isPermittedSystemAdmin,
            manageThirdPartySubscriberStatusSuccessController.get
        );
    });

    it('GET /manage-third-party-subscriber-status-success should return 200 and render view', async () => {
        const res = await request(app).get('/manage-third-party-subscriber-status-success');
        expect(res.status).toBe(200);
        expect(res.text).toBe('Rendered manage-third-party-subscriber-status-success');
    });
});
