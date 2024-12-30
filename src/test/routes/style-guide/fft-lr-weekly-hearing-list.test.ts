import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/fftLandRegistryTribunalWeeklyHearingList.json'), 'utf-8');
const rawJson = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(rawJson);

const getPublicationMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('Land Registry Weekly Hearing List Page', () => {
    const metaData = JSON.parse(rawMetaData)[0];
    metaData.listType = 'FFT_LR_WEEKLY_HEARING_LIST';

    getPublicationMetadataStub.withArgs('abc').resolves(metaData);

    describe('on GET', () => {
        test('should return land registry weekly hearing list page', async () => {
            await request(app)
                .get('/fft-lr-weekly-hearing-list?artefactId=abc')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});