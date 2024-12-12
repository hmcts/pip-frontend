import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../../unit/mocks/cstAndPhtWeeklyHearingList.json'), 'utf-8');
const rawJson = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../../unit/mocks/returnedArtefacts.json'), 'utf-8');

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(rawJson);

const getPublicationMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('CST Weekly Hearing List Page', () => {

    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'CST_WEEKLY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abc').resolves(metaData);

    describe('on GET', () => {
        test('should return cst weekly hearing list page', async () => {
            await request(app)
                .get('/cst-weekly-hearing-list?artefactId=abc')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('PHT Weekly Hearing List Page', () => {

    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'PHT_WEEKLY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abcd').resolves(metaData);

    describe('on GET', () => {
        test('should return pht weekly hearing list page', async () => {
            await request(app)
                .get('/pht-weekly-hearing-list?artefactId=abcd')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
