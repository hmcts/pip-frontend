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
});
