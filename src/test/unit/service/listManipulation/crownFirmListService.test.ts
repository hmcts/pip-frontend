import {expect} from 'chai';
import fs from 'fs';
import path from 'path';
import {CrownFirmListService} from '../../../../main/service/listManipulation/crownFirmListService';

const crownFirmListService = new CrownFirmListService();
const rawCrownFirmData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownFirmList.json'), 'utf-8');

const lng = 'en';
const languageFile = 'crown-firm-list';

describe('Crown firm list splitter service', async () => {

  const data = await crownFirmListService.splitOutFirmListData(JSON.stringify(JSON.parse(rawCrownFirmData)), lng, languageFile);
  describe('Crown firm list splitter service', () => {

    it('should format the case time in 12 hour format', async () => {
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['time']).to.equal('10:40am');
      expect(data['courtLists'][2]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['time']).to.equal('1:00pm');
    });

    it('should formatted the party information correctly for prosecution authority and defendant', async () => {
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['defendant']).to.equal('Defendant_SN, Defendant_FN');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['prosecutingAuthority']).to.equal('Pro_Auth_SN, Pro_Auth_FN');
    });

    it('should be able to find linked cases for a particular case', async () => {
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['case'][0]['linkedCases']).to.equal('caseid111, caseid222');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['case'][1]['linkedCases']).to.equal('');
    });

    it('should be able to find listing notes for a particular hearing', async () => {
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['listingNotes']).to.equal('Listing details text');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1]['listingNotes']).to.equal('');
    });

    it('should append the unallocated cases at the bottom of the courtList', async () => {
      expect(data['courtLists'].length).to.equal(5);
      expect(data['courtLists'][4]['unallocatedCases']).to.equal(true);
      expect(data['courtLists'][4]['courtHouse']['courtRoom'][0]['courtRoomName']).to.equal('to be allocated');
    });
  });
});
