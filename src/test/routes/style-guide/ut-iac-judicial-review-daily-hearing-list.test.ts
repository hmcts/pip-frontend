import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync(
    path.resolve(__dirname, '../../unit/mocks/utIacJudicialReviewDailyHearingList.json'),
    'utf-8'
);
const rawJson = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(rawJson);

const getPublicationMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('UTIAC (JR) - London Daily Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'UT_IAC_JR_LONDON_DAILY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abc').resolves(metaData);

    describe('on GET', () => {
        test('should return UTIAC (JR) - London Daily Hearing List page', async () => {
            await request(app)
                .get('/ut-iac-jr-london-daily-hearing-list?artefactId=abc')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('UTIAC (JR) - Manchester Daily Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'UT_IAC_JR_MANCHESTER_DAILY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('def').resolves(metaData);

    describe('on GET', () => {
        test('should return UTIAC (JR) - Manchester Daily Hearing List page', async () => {
            await request(app)
                .get('/ut-iac-jr-manchester-daily-hearing-list?artefactId=def')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('UTIAC (JR) - Birmingham Daily Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'UT_IAC_JR_BIRMINGHAM_DAILY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('mno').resolves(metaData);

    describe('on GET', () => {
        test('should return UTIAC (JR) - Birmingham Daily Hearing List page', async () => {
            await request(app)
                .get('/ut-iac-jr-birmingham-daily-hearing-list?artefactId=mno')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('UTIAC (JR) - Cardiff Daily Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'UT_IAC_JR_CARDIFF_DAILY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('xyz').resolves(metaData);

    describe('on GET', () => {
        test('should return UTIAC (JR) - Bristol and Cardiff Daily Hearing List page', async () => {
            await request(app)
                .get('/ut-iac-jr-cardiff-daily-hearing-list?artefactId=xyz')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('UTIAC (JR) - Leeds Daily Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'UT_IAC_JR_LEEDS_DAILY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('ghi').resolves(metaData);

    describe('on GET', () => {
        test('should return UTIAC (JR) - Leeds Daily Hearing List page', async () => {
            await request(app)
                .get('/ut-iac-jr-leeds-daily-hearing-list?artefactId=ghi')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
