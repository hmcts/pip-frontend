import {expect} from 'chai';
import {ThirdPartyService} from '../../../main/service/thirdPartyService';
import {AccountManagementRequests} from '../../../main/resources/requests/accountManagementRequests';
import sinon from 'sinon';

const thirdPartyService = new ThirdPartyService();

describe('Third Party Service tests', () => {

  describe('generateListTypes', () => {

    const listTypes = new Map([
      ['LIST_A', {
        friendlyName: 'List A',
      }],
      ['LIST_B', {
        friendlyName: 'List B',
      }],
    ]);

    const subscriptions = {
      listTypeSubscriptions: [{
        listType: 'LIST_B',
      }],
    };

    const generatedListTypes = thirdPartyService.generateListTypes(listTypes, subscriptions);

    expect(Object.keys(generatedListTypes).length).equals(2,
      'Number of list types does not match expected types');

    expect(generatedListTypes['LIST_A'].listFriendlyName).equals('List A',
      'List Friendly Name is not as expected');

    expect(generatedListTypes['LIST_A'].checked).equals(false,
      'Checked property not as expected');

    expect(generatedListTypes['LIST_B'].checked).equals(true,
      'Checked property not as expected');
  });

  describe('getThirdPartyAccounts', () => {

    const thirdPartyAccounts = [
      {
        userId: '1234-1234',
        provenanceUserId: 'ThisIsAName',
        roles: 'GENERAL_THIRD_PARTY',
        createdDate: '2022-11-20T20:20:45.001Z',
      },
      {
        userId: '2345-2345',
        provenanceUserId: 'ThisIsAnotherName',
        roles: 'GENERAL_THIRD_PARTY',
        createdDate: '2022-11-20T20:20:45.001Z',
      },
    ];

    const getThirdPartyAccountsStub = sinon.stub(AccountManagementRequests.prototype, 'getThirdPartyAccounts');
    getThirdPartyAccountsStub.resolves(thirdPartyAccounts);

    it('should return correct number of third party objects', async () => {
      const data = await thirdPartyService.getThirdPartyAccounts();
      expect(data.length).to.equal(2, 'Number of accounts returned does not match expected length');
    });

    it('should return correct details in of third party objects', async () => {
      const data = await thirdPartyService.getThirdPartyAccounts();

      const firstAccount = data[0];

      expect(firstAccount['userId']).to.equal('1234-1234', 'User ID does not match expected ID');
      expect(firstAccount['provenanceUserId']).to.equal('ThisIsAName',
        'Provenance User ID does not match expected ID');
      expect(firstAccount['roles']).to.equal('GENERAL_THIRD_PARTY',
        'Users role does not match expected role');
      expect(firstAccount['createdDate']).to.equal('20 November 2022',
        'Created date does not match expected date');
    });
  });

});
