import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../main/service/publicationService';
import { LocationService } from '../../main/service/locationService'


const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/opaPressList.json'), 'utf-8');
const jsonData = JSON.parse(rawData);
const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metadata = JSON.parse(rawMetadata)[0];

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metadata);
sinon.stub(LocationService.prototype, 'getLocationById').resolves({
    name: "Court name",
    welshName: "Welsh court name",
});

describe('OPA Press List Page', () => {
    describe('on GET', () => {
        test('should return OPA press list page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/opa-press-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
