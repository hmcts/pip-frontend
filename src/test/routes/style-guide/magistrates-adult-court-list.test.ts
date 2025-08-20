import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import { LocationService } from '../../../main/service/LocationService';
import fs from 'fs';
import path from 'path';
import { describe } from '@jest/globals';

const urlDailyList = '/magistrates-adult-court-list-daily';
const urlFutureList = '/magistrates-adult-court-list-future';
const urlPublicDailyList = '/magistrates-public-adult-court-list-daily';

const rawStandardData = fs.readFileSync(
    path.resolve(__dirname, '../../unit/mocks/magistratesAdultCourtList.json'),
    'utf-8'
);
const standardListData = JSON.parse(rawStandardData);
const rawPublicData = fs.readFileSync(
    path.resolve(__dirname, '../../unit/mocks/magistratesPublicAdultCourtList.json'),
    'utf-8'
);
const publicListData = JSON.parse(rawPublicData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');

const metadataDailyList = JSON.parse(rawMetaData)[0];
metadataDailyList.listType = 'MAGISTRATES_ADULT_COURT_LIST_DAILY';
const metadataFutureList = JSON.parse(rawMetaData)[0];
metadataFutureList.listType = 'MAGISTRATES_ADULT_COURT_LIST_FUTURE';
const metadataPublicDailyList = JSON.parse(rawMetaData)[0];
metadataPublicDailyList.listType = 'MAGISTRATES_PUBLIC_ADULT_COURT_LIST_DAILY';

sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'courtName' });
const getIndividualPublicationJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
getIndividualPublicationJsonStub.withArgs('abc').resolves(standardListData);
getIndividualPublicationJsonStub.withArgs('def').resolves(standardListData);
getIndividualPublicationJsonStub.withArgs('ace').resolves(publicListData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs('abc').returns(metadataDailyList);
metadataStub.withArgs('def').returns(metadataFutureList);
metadataStub.withArgs('ace').returns(metadataPublicDailyList);

describe('Magistrates Adult Court List Daily Page', () => {
    describe('on GET', () => {
        test('should return Magistrate Adult Court List page', async () => {
            await request(app)
                .get(urlDailyList + '?artefactId=abc')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contain('Magistrates Standard List'));
        });
    });
});

describe('Magistrates Adult Court List Future Page', () => {
    describe('on GET', () => {
        test('should return Magistrate Adult Court List page', async () => {
            await request(app)
                .get(urlFutureList + '?artefactId=def')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contain('Magistrates Standard List'));
        });
    });
});

describe('Magistrates Public Adult Court List Daily Page', () => {
    describe('on GET', () => {
        test('should return Public Magistrate Adult Court List Daily page', async () => {
            await request(app)
                .get(urlPublicDailyList + '?artefactId=ace')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contain('Magistrates Public List'));
        });
    });
});
