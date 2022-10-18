import {expect} from 'chai';
import fs from 'fs';
import path from 'path';
import {CrownDailyListService} from '../../../../main/service/listManipulation/crownDailyListService';

const crownDailyListService = new CrownDailyListService();
const rawCrownDailyData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownDailyList.json'), 'utf-8');

const lng = 'en';
const languageFile = 'crown-daily-list';

describe('Crown Data manipulation service', () => {

  describe('CrownListDataManipulatedService', () => {
    let crownDailyCause;
    beforeEach(() => {
      crownDailyCause = JSON.parse(rawCrownDailyData);
    });

    it('should formatted the case time in 12 hours format', async () => {
      const data = await crownDailyListService.manipulatedCrownDailyListData(JSON.stringify(crownDailyCause), lng, languageFile);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['time']).to.equal('10:40am');
      expect(data['courtLists'][2]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['time']).to.equal('1:00pm');
    });

    it('should formatted the party information correctly for prosecution authority and defendant', async () => {
      const data = await crownDailyListService.manipulatedCrownDailyListData(JSON.stringify(crownDailyCause), lng, languageFile);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['defendant']).to.equal('Defendant_SN, Defendant_FN');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['prosecutingAuthority']).to.equal('Pro_Auth_SN, Pro_Auth_FN');
    });

    it('should be able to find linked cases for a particular case', async () => {
      const data = await crownDailyListService.manipulatedCrownDailyListData(JSON.stringify(crownDailyCause), lng, languageFile);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['case'][0]['linkedCases']).to.equal('caseid111, caseid222');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['case'][1]['linkedCases']).to.equal('');
    });

    it('should be able to find listing notes for a particular hearing', async () => {
      const data = await crownDailyListService.manipulatedCrownDailyListData(JSON.stringify(crownDailyCause), lng, languageFile);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['listingNotes']).to.equal('Listing details text');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1]['listingNotes']).to.equal('');
    });

    it('should append the unallocated cases at the bottom of the courtList', async () => {
      const data = await crownDailyListService.findUnallocatedCasesInCrownDailyListData(JSON.stringify(crownDailyCause));
      expect(data['courtLists'].length).to.equal(5);
      expect(data['courtLists'][4]['unallocatedCases']).to.equal(true);
      expect(data['courtLists'][4]['courtHouse']['courtRoom'][0]['courtRoomName']).to.equal('to be allocated');
    });
  });
});
