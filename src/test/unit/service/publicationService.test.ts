import sinon from 'sinon';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';

import {PublicationRequests} from '../../../main/resources/requests/publicationRequests';
import {PublicationService} from '../../../main/service/publicationService';

const caseNameValue = 'test';
const caseNumberValue = '123';
const caseUrnValue = '456';

const returnedArtefact = [{
  artefactId: '123',
  search: {
    cases: [
      {caseNumber: '123', caseName: 'test name 1', caseUrn: '321'},
      {caseNumber: '321', caseName: 'NaMe TesT', caseUrn: '456'},
      {caseNumber: '432', caseName: 'not in', caseUrn: '867'}],
  },
}];

const publicationService = new PublicationService;
const publicationRequestStub = sinon.stub(PublicationRequests.prototype, 'getPublicationByCaseValue');
publicationRequestStub.resolves(returnedArtefact);

const publicationRequests = PublicationRequests.prototype;

const rawDailyCauseData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const familyDailyCauseListWithoutHearingChannelData = fs.readFileSync(path.resolve(__dirname, '../mocks/familyDailyCauseListWithoutHearingChannel.json'), 'utf-8');
const familyDailyCauseListWithoutAnyChannelData = fs.readFileSync(path.resolve(__dirname, '../mocks/familyDailyCauseListWithoutAnyChannel.json'), 'utf-8');

const rawFamilyDailyCauseData = fs.readFileSync(path.resolve(__dirname, '../mocks/familyDailyCauseList.json'), 'utf-8');
const dailyCauseListData = JSON.parse(rawDailyCauseData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../mocks/SJPMockPage.json'), 'utf-8');

const stub = sinon.stub(publicationRequests, 'getIndividualPublicationJson');
stub.returns(dailyCauseListData);
stub.withArgs().returns(dailyCauseListData);

const stubMetaData = sinon.stub(publicationRequests, 'getIndividualPublicationMetadata');
stubMetaData.returns(metaData);

const validCourtName = 'PRESTON';
const invalidCourtName = 'TEST';

describe('Publication service', () => {
  it('should return array of Search Objects based on partial case name', async () => {
    const results = await publicationService.getCasesByCaseName(caseNameValue, true);
    expect(results.length).to.equal(2);
    expect(results).not.contain(returnedArtefact[0].search.cases[2]);
  });

  it('should return Search Object matching case number', async () => {
    expect(await publicationService.getCaseByCaseNumber(caseNumberValue, true)).to.equal(returnedArtefact[0].search.cases[0]);
  });

  it('should return Search Object matching case urn', async () => {
    expect(await publicationService.getCaseByCaseUrn(caseUrnValue, true)).to.equal(returnedArtefact[0].search.cases[1]);
  });

  it('should return null processing failed request', async () => {
    expect(await publicationService.getCaseByCaseUrn('invalid', true)).is.equal(null);
  });

  describe('getIndivPubJson Service', () => {
    it('should return publication json', () => {
      return publicationService.getIndividualPublicationJson('', true).then((data) => {
        expect(data['courtLists'].length).to.equal(1);
      });
    });

    it('should have valid court name in the venue object', () => {
      return publicationService.getIndividualPublicationJson('', true).then((data) => {
        expect(data['venue']['venueName']).to.equal(validCourtName);
      });
    });

    it('should have valid court name in the venue object', () => {
      return publicationService.getIndividualPublicationJson('', true).then((data) => {
        expect(data['venue']['venueName']).not.equal(invalidCourtName);
      });
    });
  });

  describe('manipulatedDailyListData Publication Service', () => {
    it('should return daily cause list object', async () => {
      const data = await  publicationService.manipulatedDailyListData(rawDailyCauseData);
      expect(data['courtLists'].length).to.equal(1);
    });

    it('should calculate totalHearings in cause list object', async () => {
      const data = await  publicationService.manipulatedDailyListData(rawDailyCauseData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['totalHearing']).to.equal(2);
    });

    it('should calculate duration of Hearing in cause list object', async () => {
      const data = await  publicationService.manipulatedDailyListData(rawDailyCauseData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['durationAsHours']).to.equal(1);
    });

    it('should calculate start time of Hearing in cause list object', async () => {
      const data = await  publicationService.manipulatedDailyListData(rawDailyCauseData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['startTime']).to.equal('9.40am');
    });

    it('should set caseHearingChannel to sitting channel', async () => {
      const data = await publicationService.manipulatedDailyListData(rawFamilyDailyCauseData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']).to.equal('testSittingChannel');
    });

    it('should set sessionChannel to sitting channel', async () => {
      const data = await publicationService.manipulatedDailyListData(familyDailyCauseListWithoutHearingChannelData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']).to.equal('VIDEO HEARING');
    });

    it('should return empty channel if both hearing and sessionChannel are missing', async () => {
      const data = await publicationService.manipulatedDailyListData(familyDailyCauseListWithoutAnyChannelData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']).to.equal('');
    });

    //TODO: Test judiciary, then test party information
  });

  describe('getIndivPubMetadata Publication Service', () => {
    it('should return publication meta object', () => {
      return publicationService.getIndividualPublicationMetadata('', true).then((data) => {
        expect(data['contentDate']).to.equal('2022-02-14T14:14:59.73967');
      });
    });
  });

  describe('formatSJPPressList Publication Service', () => {
    it('should return SJP Press List', async () => {
      const data = await publicationService.formatSJPPressList(rawSJPData);
      expect(data['courtLists'].length).to.equal(1);
    });

    it('should formatted date of birth in correct format', async () => {
      const data = await publicationService.formatSJPPressList(rawSJPData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['party'][0]['individualDetails']['formattedDateOfBirth']).to.equal('25 July 1985');
    });

    it('should formatted Reporting Restriction in correct format', async () => {
      const data = await publicationService.formatSJPPressList(rawSJPData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['offence'][0]['formattedReportingRestriction']).to.equal('True');
    });

    it('should count total no of hearings', async () => {
      const data = await publicationService.formatSJPPressList(rawSJPData);
      expect(data['hearingCount']).to.equal(2);
    });
  });
});
