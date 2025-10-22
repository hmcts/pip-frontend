import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import { PublicationService } from '../../main/service/PublicationService';
import sinon from 'sinon';

const mockJSON = '{"data":"false"}';
const mockArray = '[{"listType": "List_A"}]';
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(mockJSON);
sinon.stub(PublicationService.prototype, 'getPublicationsByLocation').resolves(JSON.parse(mockArray));
sinon
    .stub(PublicationService.prototype, 'getListTypes')
    .returns(new Map([['List_A', { friendlyName: 'List name A' }]]));

describe('Summary of Publications', () => {
    describe('on GET', () => {
        test('should return summary of publications page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/summary-of-publications?locationId=0')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
