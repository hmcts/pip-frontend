import { app } from '../../../main/app';
import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { LocationService } from '../../../main/service/LocationService';
import { ManualUploadService } from '../../../main/service/ManualUploadService';
import { request as expressRequest } from 'express';
import { PublicationService } from '../../../main/service/PublicationService';

const URL = '/remove-list-search';

const courtServiceStub = sinon.stub(LocationService.prototype, 'getLocationById');
sinon.stub(PublicationService.prototype, 'getPublicationsByLocation').withArgs('2').resolves([]);
sinon.stub(ManualUploadService.prototype, 'formatListRemovalValues').withArgs([]).returns([]);
courtServiceStub.withArgs('2').resolves(true);
courtServiceStub.withArgs('888').resolves(false);

expressRequest['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

describe('Remove list summary page', () => {
    test('should return remove list summary page page', async () => {
        await request(app)
            .get(URL + '?locationId=2')
            .expect(res => expect(res.status).to.equal(200));
    });

    test('should return error page', async () => {
        await request(app)
            .get(URL + '?locationId=888')
            .expect(res => expect(res.status).to.equal(200));
    });
});
