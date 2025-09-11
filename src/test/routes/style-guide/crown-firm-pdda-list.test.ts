import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import { LocationService } from '../../../main/service/LocationService';
import fs from 'fs';
import path from 'path';
import { describe } from '@jest/globals';

const rawListData = fs.readFileSync(
    path.resolve(__dirname, '../../unit/mocks/crownFirmPddaList.json'),
    'utf-8'
);
const listData = JSON.parse(rawListData);

const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../unit/mocks/returnedArtefacts.json'), 'utf-8');
const metadata = JSON.parse(rawMetadata)[0];
metadata.listType = 'CROWN_FIRM_PDDA_LIST';

sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'courtName' });
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(listData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metadata);

describe('Crown Firm PDDA List Page', () => {
    describe('on GET', () => {
        test('should return Crown Firm PDDA List page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/crown-firm-pdda-list?artefactId=abc')
                .expect(res => expect(res.status).to.equal(200))
                .expect(res => expect(res.text).to.contain('Crown Firm List'));
        });
    });
});

