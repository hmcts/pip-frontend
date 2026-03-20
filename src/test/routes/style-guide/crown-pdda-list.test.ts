import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import { LocationService } from '../../../main/service/LocationService';
import fs from 'fs';
import path from 'path';
import { describe } from '@jest/globals';

const rawDailyListData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/crownDailyPddaList.json'), 'utf-8');
const dailyListData = JSON.parse(rawDailyListData);

const rawFirmListData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/crownFirmPddaList.json'), 'utf-8');
const firmListData = JSON.parse(rawFirmListData);

const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metadataDaily = JSON.parse(rawMetadata)[0];
metadataDaily.listType = 'CROWN_DAILY_PDDA_LIST';
const metadataFirm = JSON.parse(rawMetadata)[0];
metadataFirm.listType = 'CROWN_FIRM_PDDA_LIST';

sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'courtName' });

const getIndividualPublicationJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
getIndividualPublicationJsonStub.withArgs('abc').resolves(dailyListData);
getIndividualPublicationJsonStub.withArgs('def').resolves(firmListData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs('abc').returns(metadataDaily);
metadataStub.withArgs('def').returns(metadataFirm);

describe('Crown Daily PDDA List Page', () => {
    describe('on GET', () => {
        test('should return Crown Daily PDDA List page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/crown-daily-list?artefactId=abc')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contain('Crown Daily List'));
        });
    });
});

describe('Crown Firm PDDA List Page', () => {
    describe('on GET', () => {
        test('should return Crown Firm PDDA List page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/crown-firm-list?artefactId=def')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contain('Crown Firm List'));
        });
    });
});
