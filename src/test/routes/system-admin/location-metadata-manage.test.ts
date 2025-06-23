import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import sinon from 'sinon';
import { LocationService } from '../../../main/service/LocationService';

const PAGE_URL = '/location-metadata-manage?locationId=';

const locationId = '123';
const locationIdWithoutMetadata = '456';

sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'Location A' });
sinon.stub(LocationService.prototype, 'updateLocationMetadata').resolves(true);
sinon.stub(LocationService.prototype, 'addLocationMetadata').resolves(true);

const getLocationMetadataStub = sinon.stub(LocationService.prototype, 'getLocationMetadata');
getLocationMetadataStub.withArgs(locationId).resolves({ locationMetadataId: 'ABC' });
getLocationMetadataStub.withArgs(locationIdWithoutMetadata).resolves(null);

describe('Location metadata manage page', () => {
    describe('on GET', () => {
        test('should render location metadata manage page', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .get(PAGE_URL + locationId)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to location metadata update confirmed page if location metadata exists', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .post(PAGE_URL + locationId)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('location-metadata-update-confirmed');
                });
        });

        test('should redirect to location metadata create confirmed page if location metadata does not exist', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .post(PAGE_URL + locationIdWithoutMetadata)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('location-metadata-create-confirmed');
                });
        });
    });
});
