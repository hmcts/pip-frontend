import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/PublicationService';
import { LocationService } from '../../../main/service/LocationService';
import { SubscriptionService } from '../../../main/service/SubscriptionService';
import fs from 'fs';
import path from 'path';

const PAGE_URL = '/blob-view-subscription-resubmit-confirmation?artefactId=123';

const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metadata = JSON.parse(rawMetadata)[0];
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);
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
