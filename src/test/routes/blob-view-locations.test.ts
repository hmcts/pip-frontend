import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { PublicationRequests } from '../../main/resources/requests/publicationRequests';

const countPerLocation = [
    {
        locationId: '1',
        totalArtefacts: 2,
    },
    {
        locationId: '3',
        totalArtefacts: 1,
    },
];

describe('blob view locations page', () => {
    sinon.stub(PublicationRequests.prototype, 'getPubsPerLocation').returns(countPerLocation);
    describe('on GET', () => {
        test('should return blob-view-locations page', async () => {
            app.request['user'] = {
                id: '1',
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .get('/blob-view-locations')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
