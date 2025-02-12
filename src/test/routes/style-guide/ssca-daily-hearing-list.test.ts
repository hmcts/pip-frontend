import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/sscsDailyHearingList.json'), 'utf-8');
const rawJson = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(rawJson);

const getPublicationMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('Midlands First-tier Tribunal (Social Security and Child Support) Daily Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'SSCS_MIDLANDS_DAILY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abc').resolves(metaData);

    describe('on GET', () => {
        test('should return midlands first-tier tribunal (social security and child support) daily hearing List page', async () => {
            await request(app)
                .get('/sscs-midlands-daily-hearing-list?artefactId=abc')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('South East First-tier Tribunal (Social Security and Child Support) Daily Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'SSCS_SOUTHEAST_DAILY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abce').resolves(metaData);

    describe('on GET', () => {
        test('should return South east first-tier tribunal (social security and child Support) daily hearing list page', async () => {
            await request(app)
                .get('/sscs-southeast-daily-hearing-list?artefactId=abce')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('Wales and South West First-tier Tribunal (Social Security and Child Support) Daily Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'SSCS_WALES_AND_SOUTHEAST_DAILY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abce').resolves(metaData);

    describe('on GET', () => {
        test('should return wales and south west first-tier tribunal (social security and child support) daily hearing List page', async () => {
            await request(app)
                .get('/sscs-wales-and-southeast-daily-hearing-list?artefactId=abce')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('Scotland First-tier Tribunal (Social Security and Child Support) Daily Hearing List', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'SSCS_SCOTLAND_DAILY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('xyz').resolves(metaData);

    describe('on GET', () => {
        test('should return Scotland first-tier tribunal (social security and child support) daily hearing list page', async () => {
            await request(app)
                .get('/sscs-scotland-daily-hearing-list?artefactId=xyz')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('North East First-tier Tribunal (Social Security and Child Support) Daily Hearing List', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'SSCS_NORTHEAST_DAILY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('xxyz').resolves(metaData);

    describe('on GET', () => {
        test('should return north east first-tier tribunal (social security and child support) daily hearing List page', async () => {
            await request(app)
                .get('/sscs-northeast-daily-hearing-list?artefactId=xxyz')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('North West First-tier Tribunal (Social Security and Child Support) Daily Hearing List', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'SSCS_NORTHWEST_DAILY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('west').resolves(metaData);

    describe('on GET', () => {
        test('should return north west first-tier tribunal (social security and child support) daily hearing list page', async () => {
            await request(app)
                .get('/sscs-northwest-daily-hearing-list?artefactId=west')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe('London First-tier Tribunal (Social Security and Child Support) Daily Hearing List', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'SSCS_LONDON_DAILY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('lond').resolves(metaData);

    describe('on GET', () => {
        test('should return London first-tier tribunal (social security and child support) daily hearing list page', async () => {
            await request(app)
                .get('/sscs-london-daily-hearing-list?artefactId=lond')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
