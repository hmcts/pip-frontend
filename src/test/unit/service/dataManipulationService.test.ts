import {expect} from 'chai';
import fs from 'fs';
import path from 'path';
import {DataManipulationService} from '../../../main/service/dataManipulationService';

const dataManipulationService = new DataManipulationService();

const nonPresidingJudiciary = 'Firstname1 Surname1, Presiding';
const expectedApplicant = 'Surname, LEGALADVISOR: Mr Individual Forenames Individual Middlename Individual Surname';
const expectedMultipleApplicant = 'Applicant Surname1, Surname2, LEGALADVISOR: Mr Individual Forenames Individual Middlename Individual Surname';
const expectedMultipleRespondent = 'Respondent Surname1, Surname2, LEGALADVISOR: Mr Individual Forenames Individual Middlename Individual Surname';
const expectedRespondent = expectedApplicant;

const rawDailyCauseData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const rawFamilyDailyCauseData = fs.readFileSync(path.resolve(__dirname, '../mocks/familyDailyCauseList.json'), 'utf-8');
const rawFamilyDailyCausePartyMappingData = fs.readFileSync(path.resolve(__dirname, '../mocks/familyDailyCauseListPartyMapping.json'),
  'utf-8');
const rawFamilyDailyCauseWithReorderedPartyMappings = fs.readFileSync(path.resolve(__dirname, '../mocks/familyDailyCauseListWithReorderedPartyMappings.json'), 'utf-8');
const etDailyListData = fs.readFileSync(path.resolve(__dirname, '../mocks/etDailyList-withdates.json'), 'utf-8');
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

    it('should build when we have multiple applicants and the respondents of the party', async () => {
      const data = await dataManipulationService.manipulatedDailyListData(rawFamilyDailyCauseData);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][1]['hearing'][0]['applicant']).to.equal(expectedMultipleApplicant);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][1]['hearing'][0]['respondent']).to.equal(expectedMultipleRespondent);
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

    it('when there is reordered party mappings in the array, it still provides the correct mappings', async () => {
      const data = await dataManipulationService.manipulatedDailyListData(rawFamilyDailyCauseWithReorderedPartyMappings);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['applicant']).to.equal('Surname, LEGALADVISOR: Mr Forenames Middlename SurnameApplicant');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['respondent']).to.equal('Surname, LEGALADVISOR: Mr Forenames Middlename SurnameRespondent');
    });
  });

  describe('Reshaped ET Fortnightly List - splitting data from a courtroom format to a day by day view.', () => {
    it('should return ET Fortnightly List', async () => {
      const data = await dataManipulationService.reshapeEtFortnightlyListData(etDailyListData);
      expect(JSON.stringify(data).length).to.equal(2803);
    });

    it('should match the completed mock', async () => {
      const data = await dataManipulationService.reshapeEtFortnightlyListData(etDailyListData);
      expect(JSON.stringify(data)).to.contain('Lord H. Bouffant, LEGALADVISOR: Dame H. Wiggins');
    });

    it('should have data for two courthouses', async () => {
      const data = JSON.stringify(await dataManipulationService.reshapeEtFortnightlyListData(etDailyListData));
      expect(data).to.contain('Leicester Crown Court');
      expect(data).to.contain('Nottingham Justice Centre');
    });

    it('should have exactly one record for Leicester', async () => {
      const data = await dataManipulationService.reshapeEtFortnightlyListData(etDailyListData);
      expect(data[0]['courtName']).to.equal('Leicester Crown Court');
      expect(JSON.stringify(data).match('Leicester Crown Court').length).to.equal(1);
    });

    it('should have exactly four records for Nottingham', async () => {
      const data = JSON.stringify(await dataManipulationService.reshapeEtFortnightlyListData(etDailyListData));
      // the reason this is equal to 5 initially is the parent object also includes the court name as a descriptor
      expect(data.match(new RegExp('Nottingham Justice Centre', 'g')).length -1).to.equal(4);
    });

    it('should be parsing and separating dates correctly', async () => {
      const data = JSON.stringify(await dataManipulationService.reshapeEtFortnightlyListData(etDailyListData));
      const list_of_dates = ['Sunday 13 February 2022', 'Tuesday 15 February 2022', 'Monday 14 February 2022'];
      list_of_dates.forEach(value => {
        expect(data).to.contain(value);
      });
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

  describe('findAndManipulateLinkedCases', () => {
    it('should format hearing case with multiple linked case', async () => {
      const hearing = {
        case: [
          {
            caseNumber: '999',
            caseLinked: [
              {
                caseId: '123',
              },
              {
                caseId: '456',
              },
              {
                caseId: '789',
              },
            ],
          },
        ],
      };
      await dataManipulationService.findAndManipulateLinkedCases(hearing);
      expect(hearing['case'][0]['formattedLinkedCases']).to.equal('123, 456, 789');
    });

    it('should return empty string for hearing case with no linked cases', async () => {
      const hearing = {
        case: [
          {
            caseNumber: '999',
          },
        ],
      };
      await dataManipulationService.findAndManipulateLinkedCases(hearing);
      expect(hearing['case'][0]['formattedLinkedCases']).to.equal('');
    });
  });
});
