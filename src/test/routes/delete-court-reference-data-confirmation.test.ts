import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { expect } from 'chai';
import { LocationService } from '../../main/service/locationService';

const URL = '/delete-court-reference-data-confirmation';

const courtStub = sinon.stub(LocationService.prototype, 'getLocationById');
const courtDeleteStub = sinon.stub(LocationService.prototype, 'deleteLocationById');

courtStub.withArgs('2').resolves({ locationId: 2, jurisdiction: 'test', region: 'test' });
courtStub.withArgs('3').resolves({ locationId: 3, jurisdiction: 'test', region: 'test' });

courtDeleteStub.withArgs('2').resolves({ exists: false, errorMessage: '' });
courtDeleteStub.withArgs('3').resolves({ exists: true, errorMessage: 'test' });

describe('Delete Court Reference Data Confirmation', () => {
    app.request['user'] = {
        userId: '1',
        roles: 'SYSTEM_ADMIN',
    };
    describe('on GET', () => {
        test('should return court deletion confirmation page', async () => {
            await request(app)
                .get(URL + '?locationId=2')
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return error page', async () => {
            await request(app)
                .get(URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to remove list success page choice if yes and request is success', async () => {
            await request(app)
                .post(URL)
                .send({
                    'delete-choice': 'yes',
                    locationId: '2',
                })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/delete-court-reference-data-success');
                });
        });

        test('should return error page if court has active artefact and subscription', async () => {
            await request(app)
                .post(URL)
                .send({
                    'delete-choice': 'yes',
                    locationId: '3',
                })
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should return error page if no option selected', async () => {
            await request(app)
                .post(URL)
                .send({
                    'delete-choice': '',
                    locationId: '3',
                })
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect to list page if No option selected', async () => {
            await request(app)
                .post(URL)
                .send({
                    'delete-choice': 'no',
                    locationId: '2',
                })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/delete-court-reference-data');
                });
        });
    });
});
