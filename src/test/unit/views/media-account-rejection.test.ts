import {request as expressRequest} from 'express';
import {app} from '../../../main/app';
import sinon from 'sinon';
import request from 'supertest';
import {expect} from 'chai';
import {MediaAccountApplicationService} from '../../../main/service/mediaAccountApplicationService';

const applicationId = '1234';

const PAGE_URL = '/media-account-rejection?applicantId=' + applicationId;
const headingClass = 'govuk-heading-l';
const tableCaptionClass = 'govuk-table__caption';
const tableHeader = 'govuk-table__header';
const tableCell = 'govuk-table__cell';
const radioLabel = 'govuk-radios__label';
const buttonTag = 'button';
const errorSummaryClass = 'govuk-error-summary__title';
const errorMessageClass = 'govuk-error-summary__body';

const expectedHeader = 'Are you sure you want to reject this application?';
const expectedTableCaption = 'Applicant\'s Details';
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
const yesRadio = 'Yes';
const noRadio = 'No';
const continueButtonText = 'Continue';
const errorSummary = 'There is a problem';
const errorMessageNoSelection = 'An option must be selected';

let htmlRes: Document;

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

sinon.stub(expressRequest, 'isAuthenticated').returns(true);
sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus').returns(dummyApplication);

describe('Media Account Rejection Page', () => {

  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName(headingClass);
    expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
  });

  it('should display table caption', () => {
    const header = htmlRes.getElementsByClassName(tableCaptionClass);
    expect(header[0].innerHTML).contains(expectedTableCaption, 'Could not find the table caption');
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

  it('should display yes radio button', () => {
    const radioButton = htmlRes.getElementsByClassName(radioLabel);
    expect(radioButton[0].innerHTML).contains(yesRadio, 'Could not find the yes radio button');
  });

  it('should display no radio button', () => {
    const radioButton = htmlRes.getElementsByClassName(radioLabel);
    expect(radioButton[1].innerHTML).contains(noRadio, 'Could not find the no radio button');
  });

  it('should display continue button', () => {
    const button = htmlRes.getElementsByTagName(buttonTag);
    expect(button[0].innerHTML).contains(continueButtonText, 'Could not find the continue button text');
  });

});

describe('Media Account Approval No Selection', () => {

  beforeAll(async () => {
    await request(app).post(PAGE_URL).send({}).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should display the error title when no selection is entered', () => {
    const errorSummaryResult = htmlRes.getElementsByClassName(errorSummaryClass);
    expect(errorSummaryResult[0].innerHTML).contains(errorSummary, 'Error summary not found');
  });

  it('should display the error message when no selection is entered', () => {
    const errorMessage = htmlRes.getElementsByClassName(errorMessageClass);
    expect(errorMessage[0].innerHTML).contains(errorMessageNoSelection, 'Error message not found');
  });

});

describe('Media Account Approval Page Errored', () => {
  sinon.stub(MediaAccountApplicationService.prototype, 'createAccountFromApplication').returns(null);

  beforeAll(async () => {
    await request(app).post(PAGE_URL).send({'approved': 'Yes'}).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should display the error title when no selection is entered', () => {
    const errorSummaryResult = htmlRes.getElementsByClassName(errorSummaryClass);
    expect(errorSummaryResult[0].innerHTML).contains(errorSummary, 'Error summary not found');
  });

});
