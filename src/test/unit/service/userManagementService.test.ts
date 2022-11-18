import {expect} from 'chai';
import {UserManagementService} from '../../../main/service/userManagementService';

const userManagementService = new UserManagementService();

const testReqBody = {
  email: 'josh',
  userId: '',
  userProvenanceId: '',
  roles: ['VERIFIED', 'INTERNAL_ADMIN_CTSC'],
  provenances: 'PI_AAD',
};

const testManageUserSummaryAdmin = {
  userId: 'c4201452-2c4d-4389-a104-b1f078647349',
  userProvenance: 'PI_AAD',
  provenanceUserId: '4dcea424-03ed-43d6-88b8-a99ce8159da2',
  email: 'test@email.com',
  roles: 'INTERNAL_SUPER_ADMIN_CTSC',
  createdDate: '2022-11-05T18:45:37.720216',
  lastSignedInDate: '2022-11-07T18:45:37.720216',
};

const testManageUserSummaryMedia = {
  userId: 'c4201452-2c4d-4389-a104-b1f078647349',
  userProvenance: 'PI_AAD',
  provenanceUserId: '4dcea424-03ed-43d6-88b8-a99ce8159da2',
  email: 'test@email.com',
  roles: 'VERIFIED',
  createdDate: '2022-11-05T18:45:37.720216',
  lastVerifiedDate: '2022-11-07T18:45:37.720216',
};

const testClear = {
  roles: 'INTERNAL_ADMIN_LOCAL,INTERNAL_SUPER_ADMIN_LOCAL,SYSTEM_ADMIN',
  provenances: 'CRIME_IDAM',
  clear: 'roles=SYSTEM_ADMIN',
};

const testClearResponse = {
  roles: ['INTERNAL_ADMIN_LOCAL', 'INTERNAL_SUPER_ADMIN_LOCAL'],
  provenances: 'CRIME_IDAM',
};

describe('User management service', () => {
  it('should return the correct table headers', () => {
    const response = userManagementService.getTableHeaders();

    expect(response[0].text).to.equal('Email');
    expect(response[0].classes).to.equal('govuk-!-padding-top-0');
    expect(response[1].text).to.equal('Role');
    expect(response[1].classes).to.equal('govuk-!-padding-top-0');
    expect(response[2].text).to.equal('Provenance');
    expect(response[2].classes).to.equal('govuk-!-padding-top-0');
    expect(response[3].text).to.equal('');
    expect(response[3].classes).to.equal('govuk-!-padding-top-0');
  });

  it('should build user update select box', () => {
    const response = userManagementService.buildUserUpdateSelectBox('SYSTEM_ADMIN');

    expect(response[0].value).to.equal('VERIFIED');
    expect(response[0].text).to.equal('Media');
    expect(response[0].selected).to.equal(false);
    expect(response[5].value).to.equal('SYSTEM_ADMIN');
    expect(response[5].text).to.equal('System Admin');
    expect(response[5].selected).to.equal(true);
  });

  it('should generate the filter key values', () => {
    // Have to parse JSON in this way to fully replicate req.body
    const response = userManagementService.generateFilterKeyValues(JSON.parse(JSON.stringify(testReqBody)));

    expect(response).to.contain('email=josh');
    expect(response).to.contain('&roles=VERIFIED,INTERNAL_ADMIN_CTSC');
    expect(response).to.contain('&provenances=PI_AAD');
  });

  it('should build the manage user summary list for an admin user', () => {
    const response = userManagementService.buildManageUserSummaryList(testManageUserSummaryAdmin);

    expect(response['rows'][0]['key']['text']).to.contain('User ID');
    expect(response['rows'][0]['value']['text']).to.contain(testManageUserSummaryAdmin.userId);
    expect(response['rows'][1]['key']['text']).to.contain('Email');
    expect(response['rows'][1]['value']['text']).to.contain(testManageUserSummaryAdmin.email);
    expect(response['rows'][2]['key']['text']).to.contain('Role');
    expect(response['rows'][2]['value']['text']).to.contain('CTSC Super Admin');
    expect(response['rows'][2]['actions']['items'][0]['href']).to.contain('/update-user?id=' +
      testManageUserSummaryAdmin.userId);
    expect(response['rows'][3]['key']['text']).to.contain('Provenance');
    expect(response['rows'][3]['value']['text']).to.contain('B2C');
    expect(response['rows'][4]['key']['text']).to.contain('Provenance ID');
    expect(response['rows'][4]['value']['text']).to.contain(testManageUserSummaryAdmin.provenanceUserId);
    expect(response['rows'][5]['key']['text']).to.contain('Creation Date');
    expect(response['rows'][5]['value']['text']).to.contain('05/11/2022 18:45:37');
    expect(response['rows'][6]['key']['text']).to.contain('Last Sign In');
    expect(response['rows'][6]['value']['text']).to.contain('07/11/2022 18:45:37');

  });

  it('should build the manage user summary list for a media user', () => {
    const response = userManagementService.buildManageUserSummaryList(testManageUserSummaryMedia);

    expect(response['rows'][0]['key']['text']).to.contain('User ID');
    expect(response['rows'][0]['value']['text']).to.contain(testManageUserSummaryMedia.userId);
    expect(response['rows'][1]['key']['text']).to.contain('Email');
    expect(response['rows'][1]['value']['text']).to.contain(testManageUserSummaryMedia.email);
    expect(response['rows'][2]['key']['text']).to.contain('Role');
    expect(response['rows'][2]['value']['text']).to.contain('Media');
    expect(response['rows'][3]['key']['text']).to.contain('Provenance');
    expect(response['rows'][3]['value']['text']).to.contain('B2C');
    expect(response['rows'][4]['key']['text']).to.contain('Provenance ID');
    expect(response['rows'][4]['value']['text']).to.contain(testManageUserSummaryMedia.provenanceUserId);
    expect(response['rows'][5]['key']['text']).to.contain('Creation Date');
    expect(response['rows'][5]['value']['text']).to.contain('05/11/2022 18:45:37');
    expect(response['rows'][6]['key']['text']).to.contain('Last Verified');
    expect(response['rows'][6]['value']['text']).to.contain('07/11/2022 18:45:37');

  });

  it('should handle filter clearing', () => {
    const response = userManagementService.handleFilterClearing(testClear);
    expect(response).to.eql(testClearResponse);
  });

  it('should handle filter clearing all', () => {
    const response = userManagementService.handleFilterClearing({ clear: 'all'});
    expect(response).to.be.empty;
  });
});
