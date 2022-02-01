import { DailyCauseListService } from '../../../main/service/dailyCauseListService';
import sinon from 'sinon';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import {DailyCauseListRequests} from '../../../main/resources/requests/dailyCauseListRequests';

const dailyCauseListService = new DailyCauseListService();
const dailyCauseListRequests = DailyCauseListRequests.prototype;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const dailyCauseListData = JSON.parse(rawData);

const stub = sinon.stub(dailyCauseListRequests, 'getDailyCauseList').returns(dailyCauseListData);
stub.withArgs().returns(dailyCauseListData);

const validCourtName = 'PRESTON';
const invalidCourtName = 'TEST';

describe('Daily Cause List Service', () => {
  describe('getDailyCauseList Daily Cause List Service', () => {
    it('should return daily cause list object', () => {
      return dailyCauseListService.getDailyCauseList('').then((data) => {
        expect(Object.keys(['courtLists']).length).to.equal(1);
      });
    });

    it('should have valid court name in the venue object', () => {
      return dailyCauseListService.getDailyCauseList('').then((data) => {
        expect(data['venue']['venueName']).to.equal(validCourtName);
      });
    });

    it('should have valid court name in the venue object', () => {
      return dailyCauseListService.getDailyCauseList('').then((data) => {
        expect(data['venue']['venueName']).not.equal(invalidCourtName);
      });
    });
  });

  describe('calculateHearingSessionTime Daily Cause List Service', () => {
    it('should return daily cause list object', async () => {
      await dailyCauseListService.calculateHearingSessionTime(dailyCauseListData);
      expect(dailyCauseListData['courtLists'].length).to.equal(1);
    });

    it('should calculate totalHearings in cause list object', async () => {
      await dailyCauseListService.calculateHearingSessionTime(dailyCauseListData);
      expect(dailyCauseListData['courtLists'][0]['courtHouse']['courtRoom'][0]['totalHearing']).to.equal(4);
    });

    it('should calculate duration of Hearing in cause list object', async () => {
      await dailyCauseListService.calculateHearingSessionTime(dailyCauseListData);
      expect(dailyCauseListData['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['duration']).to.equal(1);
    });

    it('should calculate start time of Hearing in cause list object', async () => {
      await dailyCauseListService.calculateHearingSessionTime(dailyCauseListData);
      expect(dailyCauseListData['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['startTime']).to.equal('09am');
    });
  });
});
