import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/fftResidentialPropertyTribunalWeeklyHearingList.json'), 'utf-8');
const rawJson = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(rawJson);

const getPublicationMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('Residential Property Eastern Region Weekly Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'RPT_EASTERN_WEEKLY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abc').resolves(metaData);

    describe('on GET', () => {
        test('should return residential property eastern region weekly hearing list page', async () => {
            await request(app)
                .get('/rpt-eastern-weekly-hearing-list?artefactId=abc')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('Residential Property London Region Weekly Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'RPT_LONDON_WEEKLY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abce').resolves(metaData);

    describe('on GET', () => {
        test('should return residential property london region weekly hearing list page', async () => {
            await request(app)
                .get('/rpt-london-weekly-hearing-list?artefactId=abce')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('Residential Property Midlands Region Weekly Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'RPT_MIDLANDS_WEEKLY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abce').resolves(metaData);

    describe('on GET', () => {
        test('should return residential property midlands region weekly hearing list page', async () => {
            await request(app)
                .get('/rpt-midlands-weekly-hearing-list?artefactId=abce')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('Residential Property Northern Region Weekly Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'RPT_NORTHERN_WEEKLY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('xyz').resolves(metaData);

    describe('on GET', () => {
        test('should return residential property northern region weekly hearing list page', async () => {
            await request(app)
                .get('/rpt-northern-weekly-hearing-list?artefactId=xyz')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('Residential Property Southern Region Weekly Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'RPT_SOUTHERN_WEEKLY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('xxyz').resolves(metaData);

    describe('on GET', () => {
        test('should return residential property southern region weekly hearing list page', async () => {
            await request(app)
                .get('/rpt-southern-weekly-hearing-list?artefactId=xxyz')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
