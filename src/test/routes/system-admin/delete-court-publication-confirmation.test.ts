import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { LocationService } from '../../../main/service/LocationService';
import { PublicationService } from '../../../main/service/PublicationService';

const URL = '/delete-court-publication-confirmation';

const courtStub = sinon.stub(LocationService.prototype, 'getLocationById');
const subsDeleteStub = sinon.stub(PublicationService.prototype, 'deleteLocationPublication');

courtStub.withArgs('2').resolves({ locationId: 2, jurisdiction: 'test', region: 'test' });
subsDeleteStub.withArgs('2').resolves('success');

describe('Delete Court Publication Confirmation', () => {
    app.request['user'] = {
        userId: '1',
        roles: 'SYSTEM_ADMIN',
    };
    describe('on GET', () => {
        test('should return court publication confirmation page', async () => {
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
        test('should redirect to remove publication success page choice if yes and request is success', async () => {
            await request(app)
                .post(URL)
                .send({
                    'delete-choice': 'yes',
                    locationId: '2',
                })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/delete-court-publication-success?locationId=2');
                });
        });

        test('should return error page if no option selected', async () => {
            await request(app)
                .post(URL)
                .send({
                    'delete-choice': '',
                    locationId: '2',
                })
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect to delete court reference data page if No option selected', async () => {
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
