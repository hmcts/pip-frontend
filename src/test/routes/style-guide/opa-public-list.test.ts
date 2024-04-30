import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/PublicationService';
import { LocationService } from '../../../main/service/LocationService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/opaPublicList.json'), 'utf-8');
const jsonData = JSON.parse(rawData);
const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metadata = JSON.parse(rawMetadata)[0];

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metadata);
sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'courtName' });

describe('OPA Public List Page', () => {
    describe('on GET', () => {
        test('should return OPA public list page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/opa-public-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
