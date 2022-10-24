import {app} from '../../../main/app';
import request from 'supertest';
import {expect} from 'chai';
import sinon from 'sinon';
import {MediaAccountApplicationService} from '../../../main/service/mediaAccountApplicationService';

let htmlRes: Document;

describe('Media Account Confirmation Page', () => {

  const applicationId = '1234';

  const PAGE_URL = '/media-account-approval?applicantId=' + applicationId;
  const panelClass = 'govuk-panel__title';
  const summaryHeader = 'govuk-summary-list__key';
  const summaryCell = 'govuk-summary-list__value';
  const summaryActions = 'govuk-summary-list__actions';
  const bottomHeaderClass = 'govuk-heading-m';
  const bottomContentClass = 'govuk-body';

  const expectedPanel = 'Application has been approved';
  const nameHeader = 'Name';
  const nameValue = 'Test Name';
  const emailHeader = 'Email';
  const emailValue = 'a@b.com';
  const employerHeader = 'Employer';
  const employerValue = 'employer';
  const appliedHeader = 'Date applied';
  const appliedValue = '09 May 2022';
  const proofOfIdHeader = 'Proof of ID';
  const proofOfIdValue = 'ImageName.jpg (opens in a new window)';
  const proofOfIdView = 'View';
  const proofOfIdViewLink = '/media-account-review/image?imageId=12345&applicantId=1234';
  const bottomHeader = 'What happens next';
  const bottomContent = 'This account will be created and the applicant will be notified to set up their account. If an account already exists the applicant will be asked to sign in, or choose forgot password.';

  const dummyApplication = {
    'id': '1234',
    'fullName': 'Test Name',
    'email': 'a@b.com',
    'employer': 'employer',
    'image': '12345',
    'imageName': 'ImageName.jpg',
    'requestDate': '09 May 2022',
    'status': 'PENDING',
    'statusDate': '2022-05-09T00:00:01',
  };

  sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus').returns(dummyApplication);
  sinon.stub(MediaAccountApplicationService.prototype, 'createAccountFromApplication').returns(dummyApplication);

  app.request['user'] = {'emails': ['emailA'], _json: {
    'extension_UserRole': 'INTERNAL_SUPER_ADMIN_CTSC',
  }};

  beforeAll(async () => {
    await request(app).post(PAGE_URL).send({'approved': 'Yes'}).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should display panel', () => {
    const header = htmlRes.getElementsByClassName(panelClass);
    expect(header[0].innerHTML).contains(expectedPanel, 'Could not find the panel');
  });

  it('should display name header', () => {
    const header = htmlRes.getElementsByClassName(summaryHeader);
    expect(header[0].innerHTML).contains(nameHeader, 'Could not find the name header');
  });

  it('should display name value', () => {
    const value = htmlRes.getElementsByClassName(summaryCell);
    expect(value[0].innerHTML).contains(nameValue, 'Could not find the name value');
  });

  it('should display email header', () => {
    const header = htmlRes.getElementsByClassName(summaryHeader);
    expect(header[1].innerHTML).contains(emailHeader, 'Could not find the email header');
  });

  it('should display email value', () => {
    const value = htmlRes.getElementsByClassName(summaryCell);
    expect(value[1].innerHTML).contains(emailValue, 'Could not find the email value');
  });

  it('should display employer header', () => {
    const header = htmlRes.getElementsByClassName(summaryHeader);
    expect(header[2].innerHTML).contains(employerHeader, 'Could not find the employer header');
  });

  it('should display employer value', () => {
    const value = htmlRes.getElementsByClassName(summaryCell);
    expect(value[2].innerHTML).contains(employerValue, 'Could not find the employer value');
  });

  it('should display date applied header', () => {
    const header = htmlRes.getElementsByClassName(summaryHeader);
    expect(header[3].innerHTML).contains(appliedHeader, 'Could not find the date applied header');
  });

  it('should display date applied value', () => {
    const value = htmlRes.getElementsByClassName(summaryCell);
    expect(value[3].innerHTML).contains(appliedValue, 'Could not find the date applied value');
  });

  it('should display proof of id header', () => {
    const header = htmlRes.getElementsByClassName(summaryHeader);
    expect(header[4].innerHTML).contains(proofOfIdHeader, 'Could not find the proof of id header');
  });

  it('should display proof of id value', () => {
    const value = htmlRes.getElementsByClassName(summaryCell);
    expect(value[4].innerHTML).contains(proofOfIdValue, 'Could not find the proof of id value');
  });

  it('should display proof of id view text', () => {
    const value = htmlRes.getElementsByClassName(summaryActions);
    const anchor = value[4].getElementsByTagName('a')[0];
    expect(anchor.innerHTML).contains(proofOfIdView, 'Could not find the proof of id view text');
  });

  it('should display proof of id view link', () => {
    const value = htmlRes.getElementsByClassName(summaryActions);
    const anchor = value[4].getElementsByTagName('a')[0];
    expect(anchor.getAttribute('href')).contains(proofOfIdViewLink, 'Could not find the proof of id view text');
  });

  it('should display the bottom header', () => {
    const header = htmlRes.getElementsByClassName(bottomHeaderClass);
    expect(header[0].innerHTML).contains(bottomHeader, 'Could not find the bottom header');
  });

  it('should display the bottom content', () => {
    const header = htmlRes.getElementsByClassName(bottomContentClass);
    expect(header[0].innerHTML).contains(bottomContent, 'Could not find the bottom content');
  });

});
