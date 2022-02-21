import sinon from 'sinon';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';

import {PublicationRequests} from '../../../main/resources/requests/publicationRequests';
import {SummaryOfPublicationsService} from '../../../main/service/summaryOfPublicationsService';

const summaryOfPublicationsService = new SummaryOfPublicationsService();
const publicationRequests = PublicationRequests.prototype;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const dailyCauseListData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseListMetaData.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData);

const stub = sinon.stub(publicationRequests, 'getIndividualPubJson').returns(dailyCauseListData);
stub.withArgs().returns(dailyCauseListData);

const stubMetaData = sinon.stub(publicationRequests, 'getIndividualPubMetadata').returns(metaData);
stubMetaData.withArgs().returns(metaData);

const validCourtName = 'PRESTON';
const invalidCourtName = 'TEST';

describe('Publication Service', () => {
  describe('getIndivPubJson Service', () => {
    it('should return publication json', () => {
      return summaryOfPublicationsService.getIndivPubJson('', true).then((data) => {
        expect(data['courtLists'].length).to.equal(1);
      });
    });

    it('should have valid court name in the venue object', () => {
      return summaryOfPublicationsService.getIndivPubJson('', true).then((data) => {
        expect(data['venue']['venueName']).to.equal(validCourtName);
      });
    });

    it('should have valid court name in the venue object', () => {
      return summaryOfPublicationsService.getIndivPubJson('', true).then((data) => {
        expect(data['venue']['venueName']).not.equal(invalidCourtName);
      });
    });
  });

  describe('calculateHearingSessionTime Daily Cause List Service', () => {
    it('should return daily cause list object', async () => {
      await summaryOfPublicationsService.calculateHearingSessionTime(dailyCauseListData);
      expect(dailyCauseListData['courtLists'].length).to.equal(1);
    });

    it('should calculate totalHearings in cause list object', async () => {
      await summaryOfPublicationsService.calculateHearingSessionTime(dailyCauseListData);
      expect(dailyCauseListData['courtLists'][0]['courtHouse']['courtRoom'][0]['totalHearing']).to.equal(4);
    });

    it('should calculate duration of Hearing in cause list object', async () => {
      await summaryOfPublicationsService.calculateHearingSessionTime(dailyCauseListData);
      expect(dailyCauseListData['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['durationAsHours']).to.equal(1);
    });

    it('should calculate start time of Hearing in cause list object', async () => {
      await summaryOfPublicationsService.calculateHearingSessionTime(dailyCauseListData);
      expect(dailyCauseListData['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['startTime']).to.equal('9.40am');
    });
  });

  describe('getIndivPubMetadata Publication Service', () => {
    it('should return publication meta object', () => {
      return summaryOfPublicationsService.getIndivPubMetadata('', true).then((data) => {
        expect(data['contentDate']).to.equal('2022-02-04T11:01:20.734Z');
      });
    });
  });
});
