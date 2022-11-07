import {expect} from 'chai';
import fs from 'fs';
import path from 'path';
import {MagsStandardListService} from '../../../../main/service/listManipulation/magsStandardListService';

const magsStandardListService = new MagsStandardListService();
const rawMagistrateStandardListData = fs.readFileSync(path.resolve(__dirname, '../../mocks/magsStandardList.json'), 'utf-8');

const lng = 'en';
const languageFile = 'mags-standard-list';

describe('Magistrate Standard List Data manipulation service', () => {

  describe('MagsStandardListService', () => {
    let magistrateStandardList;
    beforeEach(() => {
      magistrateStandardList = JSON.parse(rawMagistrateStandardListData);
    });

    it('should formatted the case time in 12 hours format', async () => {
      const data = await magsStandardListService.manipulatedMagsStandardListData(magistrateStandardList, lng, languageFile);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['time']).to.equal('2:30pm');
    });

    it('should formatted the party information correctly', async () => {
      const data = await magsStandardListService.manipulatedMagsStandardListData(magistrateStandardList, lng, languageFile);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['defendantHeading']).to.equal('Surname1, John Smith1');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['defendantDateOfBirth']).to.equal('01/01/1983');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['defendantAddress']).to.equal('Address Line 1, Address Line 2, Month A, County A, AA1 AA1');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['age']).to.equal(39);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['gender']).to.equal('male');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['plea']).to.equal('NOT_GUILTY');
    });

    it('should formatted conviction and adjournedDate date correctly', async () => {
      const data = await magsStandardListService.manipulatedMagsStandardListData(magistrateStandardList, lng, languageFile);
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['case'][0]['formattedConvictionDate']).to.equal('14/09/2016');
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['case'][0]['formattedAdjournedDate']).to.equal('14/09/2016');
    });
  });
});
