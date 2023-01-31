import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import { LiveCaseService } from '../../main/service/liveCaseService';
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/liveCaseStatusUpdates.json'), 'utf-8');
const liveCases = JSON.parse(rawData).results;

sinon.stub(LiveCaseService.prototype, 'getLiveCases').returns(liveCases);

describe.skip('Live Status', () => {
    describe('on GET', () => {
        test('should return live status page', async () => {
            await request(app)
                .get('/live-case-status?locationId=26')
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
