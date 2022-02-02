import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../main/app';
import {DailyCauseListService} from '../../main/service/dailyCauseListService';
import fs from 'fs';
import path from 'path';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/dailyCauseList.json'), 'utf-8');
const dailyReferenceData = JSON.parse(rawData);
sinon.stub(DailyCauseListService.prototype, 'getDailyCauseList').resolves(dailyReferenceData);
sinon.stub(DailyCauseListService.prototype, 'calculateHearingSessionTime').resolves(dailyReferenceData);

describe('Daily Cause List Page', () => {
  describe('on GET', () => {
    test('should return daily cause list page', () => {
      request(app)
        .get('/daily-cause-list?artefactId=10b6e951-2746-4fab-acad-564dcac9c58d')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
