import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import { LocationService } from '../../../main/service/LocationService';
import fs from 'fs';
import path from 'path';
import { MagistratesAdultCourtListService } from '../../../main/service/listManipulation/MagistratesAdultCourtListService';
import { describe } from '@jest/globals';

const urlDailyList = '/magistrates-adult-court-list-daily';
const urlFutureList = '/magistrates-adult-court-list-future';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/magistratesAdultCourtList.json'), 'utf-8');
const listData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');

const metadataDailyList = JSON.parse(rawMetaData)[0];
metadataDailyList.listType = 'MAGISTRATES_ADULT_COURT_LIST_DAILY';
const metadataFutureList = JSON.parse(rawMetaData)[0];
metadataFutureList.listType = 'MAGISTRATES_ADULT_COURT_LIST_FUTURE';

sinon.stub(MagistratesAdultCourtListService.prototype, 'processPayload').resolves(listData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'courtName' });
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(listData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs('abc').returns(metadataDailyList);
metadataStub.withArgs('def').returns(metadataFutureList);

describe("Magistrates Adult Court List Daily Page", () => {
    describe('on GET', () => {
        test('should return Magistrate Adult Court List page', async () => {
            await request(app)
                .get(urlDailyList + '?artefactId=abc')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});

describe("Magistrates Adult Court List Future Page", () => {
    describe('on GET', () => {
        test('should return Magistrate Adult Court List page', async () => {
            await request(app)
                .get(urlFutureList + '?artefactId=def')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
