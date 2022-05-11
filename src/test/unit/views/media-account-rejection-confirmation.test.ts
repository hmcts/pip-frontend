import {app} from '../../../main/app';
import request from 'supertest';
import {expect} from 'chai';
import sinon from 'sinon';
import {MediaAccountApplicationService} from '../../../main/service/mediaAccountApplicationService';
import {request as expressRequest} from 'express';

let htmlRes: Document;

describe('Media Account Submission Page', () => {

  const applicationId = '1234';

  const PAGE_URL = '/media-account-rejection?applicantId=' + applicationId;
  const panelClass = 'govuk-panel__title';
  const tableHeader = 'govuk-table__header';
  const tableCell = 'govuk-table__cell';
  const bottomHeaderClass = 'govuk-heading-m';
  const bottomContentClass = 'govuk-inset-text';

  const expectedPanel = 'Account has been rejected.';
  const nameHeader = 'Name';
  const nameValue = 'Test Name';
  const emailHeader = 'Email';
  const emailValue = 'a@b.com';
  const employerHeader = 'Employer';
  const employerValue = 'employer';
  const appliedHeader = 'Date applied';
  const appliedValue = '09 May 2022';
  const proofOfIdHeader = 'Proof of ID';
  const proofOfIdValue = 'ImageName.jpg (opens in new tab)';
  const proofOfIdView = 'View';
  const proofOfIdViewLink = '/media-account-review/image?imageId=12345&applicantId=1234';
  const bottomHeader = 'What happens next';
  const bottomContent = 'Your request for a court and tribunals hearings account has been rejected for the following reason(s)';

  const dummyApplication = {
    'id': '1234',
    'fullName': 'Test Name',
    'email': 'a@b.com',
    'employer': 'employer',
    'image': '12345',
    'imageName': 'ImageName.jpg',
    'requestDate': '09 May 2022',
    'status': 'REJECTED',
    'statusDate': '2022-05-09T00:00:01',
  };
  sinon.stub(expressRequest, 'isAuthenticated').returns(true);
  sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus').returns(dummyApplication);
  sinon.stub(MediaAccountApplicationService.prototype, 'rejectApplication').returns(dummyApplication);

  beforeAll(async () => {
    await request(app).post(PAGE_URL).send({'reject-confirmation': 'Yes'}).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should display panel', () => {
    const header = htmlRes.getElementsByClassName(panelClass);
    expect(header[0].innerHTML).contains(expectedPanel, 'Could not find the panel');
  });

  it('should display name header', () => {
    const header = htmlRes.getElementsByClassName(tableHeader);
    expect(header[0].innerHTML).contains(nameHeader, 'Could not find the name header');
  });

  it('should display name value', () => {
    const value = htmlRes.getElementsByClassName(tableCell);
    expect(value[0].innerHTML).contains(nameValue, 'Could not find the name value');
  });

  it('should hide last column for display name', () => {
    const value = htmlRes.getElementsByClassName(tableCell);
    expect(value[1].hasAttribute('aria-hidden')).to.be.true;
  });

  it('should display email header', () => {
    const header = htmlRes.getElementsByClassName(tableHeader);
    expect(header[1].innerHTML).contains(emailHeader, 'Could not find the email header');
  });

  it('should display email value', () => {
    const value = htmlRes.getElementsByClassName(tableCell);
    expect(value[2].innerHTML).contains(emailValue, 'Could not find the email value');
  });

  it('should hide last column for email', () => {
    const value = htmlRes.getElementsByClassName(tableCell);
    expect(value[3].hasAttribute('aria-hidden')).to.be.true;
  });

  it('should display employer header', () => {
    const header = htmlRes.getElementsByClassName(tableHeader);
    expect(header[2].innerHTML).contains(employerHeader, 'Could not find the employer header');
  });

  it('should display employer value', () => {
    const value = htmlRes.getElementsByClassName(tableCell);
    expect(value[4].innerHTML).contains(employerValue, 'Could not find the employer value');
  });

  it('should hide last column for employer', () => {
    const value = htmlRes.getElementsByClassName(tableCell);
    expect(value[5].hasAttribute('aria-hidden')).to.be.true;
  });

  it('should display date applied header', () => {
    const header = htmlRes.getElementsByClassName(tableHeader);
    expect(header[3].innerHTML).contains(appliedHeader, 'Could not find the date applied header');
  });

  it('should display date applied value', () => {
    const value = htmlRes.getElementsByClassName(tableCell);
    expect(value[6].innerHTML).contains(appliedValue, 'Could not find the date applied value');
  });

  it('should hide last column for date applied', () => {
    const value = htmlRes.getElementsByClassName(tableCell);
    expect(value[7].hasAttribute('aria-hidden')).to.be.true;
  });

  it('should display proof of id header', () => {
    const header = htmlRes.getElementsByClassName(tableHeader);
    expect(header[4].innerHTML).contains(proofOfIdHeader, 'Could not find the proof of id header');
  });

  it('should display proof of id value', () => {
    const value = htmlRes.getElementsByClassName(tableCell);
    expect(value[8].innerHTML).contains(proofOfIdValue, 'Could not find the proof of id value');
  });

  it('should display proof of id view text', () => {
    const value = htmlRes.getElementsByClassName(tableCell);
    const anchor = value[9].getElementsByTagName('a')[0];
    expect(anchor.innerHTML).contains(proofOfIdView, 'Could not find the proof of id view text');
  });

  it('should display proof of id view link', () => {
    const value = htmlRes.getElementsByClassName(tableCell);
    const anchor = value[9].getElementsByTagName('a')[0];
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
