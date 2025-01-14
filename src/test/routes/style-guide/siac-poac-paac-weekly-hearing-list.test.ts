import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/siacWeeklyHearingList.json'), 'utf-8');
const rawJson = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(rawJson);

const getPublicationMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('SIAC Weekly Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'SIAC_WEEKLY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abc').resolves(metaData);

    describe('on GET', () => {
        test('should return special immigration appeals commission weekly hearing list page', async () => {
            await request(app)
                .get('/siac-weekly-hearing-list?artefactId=abc')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('POAC Weekly Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'POAC_WEEKLY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abcd').resolves(metaData);

    describe('on GET', () => {
        test('should return proscribed organisations appeal commission weekly hearing list page', async () => {
            await request(app)
                .get('/poac-weekly-hearing-list?artefactId=abcd')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('PAAC Weekly Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'PAAC_WEEKLY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abce').resolves(metaData);

    describe('on GET', () => {
        test('should return pathogens access appeal commission weekly hearing list page', async () => {
            await request(app)
                .get('/paac-weekly-hearing-list?artefactId=abce')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
