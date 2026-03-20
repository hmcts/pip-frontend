import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';
import { CrownWarnedPddaListService } from '../../../main/service/listManipulation/CrownWarnedPddaListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/crownWarnedPddaList.json'), 'utf-8');
const crownWarnedPddaData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const listData = new Map<string, object[]>();
const value = {
    fixedDate: '1',
    caseReference: '2',
    defendantNames: '3',
    prosecutingAuthority: '4',
    linkedCases: '5',
    listingNotes: '6',
};
listData.set('Hearing type', [value]);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(crownWarnedPddaData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);
sinon.stub(CrownWarnedPddaListService.prototype, 'processPayload').returns(listData);

describe('Crown Warned PDDA List Page', () => {
    describe('on GET', () => {
        test('should return crown warned pdda list page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/crown-warned-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
