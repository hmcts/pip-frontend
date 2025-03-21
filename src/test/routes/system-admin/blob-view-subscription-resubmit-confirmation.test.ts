import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/PublicationService';
import { LocationService } from '../../../main/service/LocationService';
import { SubscriptionService } from '../../../main/service/SubscriptionService';

const PAGE_URL = '/blob-view-subscription-resubmit-confirmation?artefactId=123';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves({
    locationId: 1,
    type: 'LIST',
    listType: 'CIVIL_DAILY_CAUSE_LIST',
    provenance: 'MANUAL_UPLOAD',
    language: 'ENGLISH',
    sensitivity: 'PUBLIC',
    contentDate: '2025-03-20T00:00:00Z',
    displayFrom: '2025-03-20T00:00:00Z',
    displayTo: '2025-03-21T00:00:00Z',
});
sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'Location A' });
sinon.stub(SubscriptionService.prototype, 'fulfillSubscriptions').resolves('success');

describe('Blob view subscription re-submit confirmation page', () => {
    describe('on GET', () => {
        test('should render blob view subscription re-submit confirmation page', async () => {
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
        test('should redirect to blob view subscription resubmit confirmed page', async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .post(PAGE_URL)
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('blob-view-subscription-resubmit-confirmed');
                });
        });
    });
});
