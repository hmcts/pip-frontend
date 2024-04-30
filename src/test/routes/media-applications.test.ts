import request from 'supertest';
import { app } from '../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import sinon from 'sinon';
import { MediaAccountApplication } from '../../main/models/MediaAccountApplication';
import { MediaAccountApplicationService } from '../../main/service/MediaAccountApplicationService';

expressRequest['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

const mediaAccount = {
    id: '1234',
} as MediaAccountApplication;

describe('Media applications', () => {
    describe('GET', () => {
        test('should return media applications page', async () => {
            sinon
                .stub(MediaAccountApplicationService.prototype, 'getDateOrderedMediaApplications')
                .resolves([mediaAccount]);

            await request(app)
                .get('/media-applications')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
