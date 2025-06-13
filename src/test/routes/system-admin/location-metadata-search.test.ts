import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import sinon from 'sinon';
import { LocationService } from '../../../main/service/LocationService';

const PAGE_URL = '/location-metadata-search';

sinon.stub(LocationService.prototype, 'getLocationById').resolves([{ name: 'Location A' }, { name: 'Location B' }]);
const getLocationByNameStub = sinon.stub(LocationService.prototype, 'getLocationByName');

getLocationByNameStub.withArgs('Location A').resolves('success');
getLocationByNameStub.withArgs('Location C').resolves(null);

describe('Location metadata search page', () => {
    describe('on GET', () => {
        test('should render location metadata search page', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to location metadata manage page', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };
            app.request['body'] = {
                'input-autocomplete': 'Location A',
            };
            await request(app)
                .post(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.contain('location-metadata-manage');
                });
        });

        test('should render location metadata search page with error', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };
            app.request['body'] = {
                'input-autocomplete': 'Location C',
            };
            await request(app)
                .post(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
