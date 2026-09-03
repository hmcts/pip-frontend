import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';
import { CrownAdvancePddaListService } from '../../../main/service/listManipulation/CrownAdvancePddaListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/crownAdvancePddaList.json'), 'utf-8');
const crownAdvancePddaData = JSON.parse(rawData);
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

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(crownAdvancePddaData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);
sinon.stub(CrownAdvancePddaListService.prototype, 'processPayload').returns(listData);

describe('Crown Advance PDDA List Page', () => {
    describe('on GET', () => {
        test('should return crown advance pdda list page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/crown-advance-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
