import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { PublicationService } from '../../main/service/publicationService';
import fs from 'fs';
import path from 'path';
import { SjpPressListService } from '../../main/service/listManipulation/SjpPressListService';
import { SjpFilterService } from '../../main/service/sjpFilterService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/sjp-press-list.json'), 'utf-8');
const sjpPressData = JSON.parse(rawData);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(sjpPressData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(sjpPressData);
sinon.stub(SjpPressListService.prototype, 'formatSJPPressList').resolves([]);

const filter = { sjpCases: ['1', '2'], filterOptions: {} };
sinon.stub(SjpFilterService.prototype, 'generateFilters').returns(filter);

describe('Single Justice Procedure Press Page', () => {
    describe('on GET', () => {
        test('should return Single Justice Procedure Press page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .get('/sjp-press-list?artefactId=test')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to Single Justice Procedure Press page', async () => {
            app.request['user'] = { userId: '2' };
            await request(app)
                .post('/sjp-press-list?artefactId=test&filterValues=AA1')
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).contains('sjp-press-list');
                });
        });
    });
});
