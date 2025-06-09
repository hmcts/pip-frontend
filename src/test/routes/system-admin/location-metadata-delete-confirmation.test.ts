import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import sinon from 'sinon';
import { LocationService } from '../../../main/service/LocationService';

const PAGE_URL = '/location-metadata-delete-confirmation?locationId=';

const locationId = '123';
const locationIdWithFailedRequest = '124';

sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'Location A' });
const getLocationMetadataStub = sinon.stub(LocationService.prototype, 'getLocationMetadata');
const deleteLocationMetadataStub = sinon.stub(LocationService.prototype, 'deleteLocationMetadataById');

getLocationMetadataStub.withArgs(locationId).resolves({ locationMetadataId: '456' });
getLocationMetadataStub.withArgs(locationIdWithFailedRequest).resolves({ locationMetadataId: '457' });

deleteLocationMetadataStub.withArgs('456').resolves(true);
deleteLocationMetadataStub.withArgs('457').resolves(false);

describe('Location metadata delete confirmation page', () => {
    describe('on GET', () => {
        test('should render location metadata delete confirmation page', async () => {
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
        test('should redirect to location metadata delete confirmed page', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };
            app.request['body'] = {
                'delete-location-metadata-confirm': 'yes',
            };
            await request(app)
                .post(PAGE_URL + locationId)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('location-metadata-delete-confirmed');
                });
        });

        test('should render location metadata delete confirmation page with error', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .post(PAGE_URL + locationIdWithFailedRequest)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
