import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { PublicationService } from '../../../main/service/PublicationService';
import { LocationService } from '../../../main/service/LocationService';

const URL = '/remove-list-confirmation';

const mockArtefact = {
    listType: 'CIVIL_DAILY_CAUSE_LIST',
    listTypeName: 'Civil Daily Cause List',
    contentDate: '2022-03-24T07:36:35',
    locationId: '1',
    artefactId: 'valid-artefact',
    language: 'ENGLISH',
    displayFrom: '2022-03-23T07:36:35',
    displayTo: '2022-03-28T07:36:35',
    sensitivity: 'CLASSIFIED',
};

const removePublicationStub = sinon.stub(PublicationService.prototype, 'removePublication');
const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves({ locationId: '1', name: 'Mock Court' });
removePublicationStub.withArgs('valid-artefact', '1234-1234-1234-1234').resolves(true);
removePublicationStub.withArgs('invalid-artefact', '1234-1234-1234-1234').resolves(false);
metadataStub.withArgs('valid-artefact', '1234-1234-1234-1234').resolves(mockArtefact);
metadataStub
    .withArgs('invalid-artefact', '1234-1234-1234-1234')
    .resolves({ ...mockArtefact, artefactId: 'invalid-artefact' });

describe('Remove List Confirmation', () => {
    app.request['user'] = {
        userId: '1234-1234-1234-1234',
        roles: 'SYSTEM_ADMIN',
    };
    describe('on GET', () => {
        test('should return remove list confirmation page', async () => {
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
                    'remove-choice': 'yes',
                    artefactIds: ['valid-artefact'],
                    locationId: '1',
                })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/remove-list-success');
                });
        });

        test('should return error page if choice is yes and request fails', async () => {
            await request(app)
                .post(URL)
                .send({
                    'remove-choice': 'yes',
                    artefactIds: ['invalid-artefact'],
                    locationId: '1',
                })
                .expect(res => expect(res.status).to.equal(200));
        });

        test('should redirect to remove list summary page if choice is no', async () => {
            await request(app)
                .post(URL)
                .send({
                    'remove-choice': 'no',
                    artefactIds: ['valid-artefact'],
                    locationId: '1',
                    language: 'ENGLISH',
                    displayFrom: '2022-03-23T07:36:35',
                    displayTo: '2022-03-28T07:36:35',
                    sensitivity: 'CLASSIFIED',
                })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('/remove-list-search-results?locationId=1');
                });
        });

        test('should return remove list confirmation page if choice is blank', async () => {
            await request(app)
                .post(URL)
                .send({
                    artefactIds: ['valid-artefact'],
                    locationId: '1',
                })
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
