import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import fs from 'fs';
import path from 'path';
import { CrownWarnedListService } from '../../main/service/listManipulation/CrownWarnedListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/crownWarnedList.json'), 'utf-8');
const crownWarnedData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const listData = new Map<string, object[]>();
const value = {
    caseReference: '1',
    defendant: '2',
    hearingDate: '3',
    defendantRepresentative: '4',
    prosecutingAuthority: '5',
    linkedCases: '6',
    listingNotes: '7',
};
listData.set('Hearing type', [value]);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(crownWarnedData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);
sinon.stub(CrownWarnedListService.prototype, 'manipulateData').returns(listData);

describe('Crown Warned List Page', () => {
    describe('on GET', () => {
        test('should return crown warned list page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/crown-warned-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
