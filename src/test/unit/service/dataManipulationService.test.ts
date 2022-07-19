import {expect} from 'chai';
import fs from 'fs';
import path from 'path';
import {DataManipulationService} from '../../../main/service/dataManipulationService';

const dataManipulationService = new DataManipulationService();

const nonPresidingJudiciary = 'Firstname1 Surname1, Presiding';
const expectedApplicant = 'Surname, LEGALADVISOR: Mr Individual Forenames Individual Middlename Individual Surname';
const expectedRespondent = expectedApplicant;

const rawDailyCauseData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const rawFamilyDailyCauseData = fs.readFileSync(path.resolve(__dirname, '../mocks/familyDailyCauseList.json'), 'utf-8');
const rawFamilyDailyCausePartyMappingData = fs.readFileSync(path.resolve(__dirname, '../mocks/familyDailyCauseListPartyMapping.json'),
  'utf-8');
const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../mocks/SJPMockPage.json'), 'utf-8');

const dailyCauseListData = JSON.parse(rawDailyCauseData);

describe('Data manipulation service', () => {

  describe('manipulatedDailyListData', () => {
    let familyDailyCause;
    beforeEach(() => {
      familyDailyCause = JSON.parse(rawFamilyDailyCauseData);
    });

    it('should return daily cause list object', async () => {
      const data = await  dataManipulationService.manipulatedDailyListData(rawDailyCauseData);
      expect(data['courtLists'].length).to.equal(4);
    });

    it('should calculate totalHearings in cause list object', async () => {
      const data = await dataManipulationService.manipulatedDailyListData(rawDailyCauseData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['totalHearing']).to.equal(4);
    });

    it('should calculate duration of Hearing in cause list object', async () => {
      const data = await dataManipulationService.manipulatedDailyListData(rawDailyCauseData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['durationAsHours']).to.equal(1);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['durationAsMinutes']).to.equal(5);
    });

    it('should calculate duration more than one hour of Hearing in cause list object', async () => {
      const data = await  dataManipulationService.manipulatedDailyListData(rawDailyCauseData);
      expect(data['courtLists'][1]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['durationAsHours']).to.equal(1);
      expect(data['courtLists'][1]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['durationAsMinutes']).to.equal(30);
    });

    it('should calculate duration is one hour of Hearing in cause list object', async () => {
      const data = await  dataManipulationService.manipulatedDailyListData(rawDailyCauseData);
      expect(data['courtLists'][2]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['durationAsHours']).to.equal(1);
      expect(data['courtLists'][2]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['durationAsMinutes']).to.equal(0);
    });

    it('should calculate duration less than a hour of Hearing in cause list object', async () => {
      const data = await  dataManipulationService.manipulatedDailyListData(rawDailyCauseData);
      expect(data['courtLists'][3]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['durationAsHours']).to.equal(0);
      expect(data['courtLists'][3]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['durationAsMinutes']).to.equal(30);
    });

    it('should calculate start time of Hearing in cause list object', async () => {
      const data = await dataManipulationService.manipulatedDailyListData(rawDailyCauseData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['startTime']).to.equal('10.40am');
    });

    it('should set caseHearingChannel to sitting channel', async () => {
      const data = await dataManipulationService.manipulatedDailyListData(rawFamilyDailyCauseData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']).to.equal('testSittingChannel');
    });

    it('should set sessionChannel to sitting channel', async () => {
      familyDailyCause['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['channel'] = [];
      const data = await dataManipulationService.manipulatedDailyListData(JSON.stringify(familyDailyCause));
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']).to.equal('VIDEO HEARING');
    });

    it('should return empty channel if both hearing and sessionChannel are missing', async () => {
      familyDailyCause['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['channel'] = [];
      familyDailyCause['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sessionChannel'] = [];
      const data = await dataManipulationService.manipulatedDailyListData(JSON.stringify(familyDailyCause));
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']).to.equal('');
    });

    it('should set judiciary to presiding judiciary over other judiciaries', async () => {
      const data = await dataManipulationService.manipulatedDailyListData(rawFamilyDailyCauseData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['formattedJudiciaries']).to.equal('Presiding');
    });

    it('should concat judiciaries with no presiding', async () => {
      familyDailyCause['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['judiciary'][1]['isPresiding'] = false;
      const data = await dataManipulationService.manipulatedDailyListData(JSON.stringify(familyDailyCause));
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['formattedJudiciaries']).to.equal(nonPresidingJudiciary);
    });

    it('should build the applicants and the respondents of the party', async () => {
      const data = await dataManipulationService.manipulatedDailyListData(rawFamilyDailyCauseData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['applicant']).to.equal(expectedApplicant);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['respondent']).to.equal(expectedRespondent);
    });

    it('should build the applicants and the respondents of the party with data that requires mapping', async () => {
      const data = await dataManipulationService.manipulatedDailyListData(rawFamilyDailyCausePartyMappingData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['applicant']).to.equal(expectedApplicant);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['respondent']).to.equal(expectedRespondent);
    });

    it('should build only the applicants and the respondents representative of the party', async () => {
      const data = await dataManipulationService.manipulatedDailyListData(rawFamilyDailyCausePartyMappingData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1]['applicant']).to.equal('LEGALADVISOR: Individual Surname');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1]['respondent']).to.equal('LEGALADVISOR: Individual Surname');
    });

    it('should build only the applicants and the respondents of the party', async () => {
      const data = await dataManipulationService.manipulatedDailyListData(rawFamilyDailyCausePartyMappingData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][2]['applicant']).to.equal('Individual Surname');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][2]['respondent']).to.equal('Individual Surname');
    });

    it('when there is no party information provided', async () => {
      const data = await dataManipulationService.manipulatedDailyListData(rawFamilyDailyCausePartyMappingData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][3]['applicant']).to.equal(undefined);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][3]['respondent']).to.equal(undefined);
    });
  });

  describe('formatSJPPressList', () => {
    it('should return SJP Press List', async () => {
      const data = await dataManipulationService.formatSJPPressList(rawSJPData);
      expect(data['courtLists'].length).to.equal(1);
    });

    it('should formatted date of birth in correct format', async () => {
      const data = await dataManipulationService.formatSJPPressList(rawSJPData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['party'][0]['individualDetails']['formattedDateOfBirth']).to.equal('25 July 1985');
    });

    it('should formatted Reporting Restriction in correct format', async () => {
      const data = await dataManipulationService.formatSJPPressList(rawSJPData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['offence'][0]['formattedReportingRestriction']).to.equal('True');
    });

    it('should count total no of hearings', async () => {
      const data = await dataManipulationService.formatSJPPressList(rawSJPData);
      expect(data['hearingCount']).to.equal(2);
    });
  });

  describe('Publication Date and Time', () => {
    it('should return Publication Time accounting for BST', async () => {
      const data = await dataManipulationService.publicationTimeInBst(dailyCauseListData['document']['publicationDate']);
      expect(data).to.equal('12:30am');
    });

    it('should return Publication Date accounting for BST', async () => {
      const data = await dataManipulationService.publicationDateInBst(dailyCauseListData['document']['publicationDate']);

      expect(data).to.equal('14 September 2020');
    });
  });
});
