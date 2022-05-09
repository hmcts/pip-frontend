import {AccountManagementRequests} from "../../../main/resources/requests/accountManagementRequests";
import sinon from 'sinon';
import request from "supertest";
import {app} from "../../../main/app";
import {expect} from "chai";

describe('Media Account Review Test', () => {

  const applicationId = '1234';

  const PAGE_URL = '/media-account-review?applicantId=' + applicationId;
  const headingClass = 'govuk-heading-l';
  const tableHeader = 'govuk-table__header';
  const tableCell = 'govuk-table__cell';
  const buttonTag = 'button';

  const expectedHeader = 'Applicant\'s details';
  const nameHeader = 'Name';
  const nameValue = 'Test Name';
  const emailHeader = 'Email';
  const emailValue = "a@b.com";
  const employerHeader = 'Employer';
  const employerValue = 'employer';
  const appliedHeader = 'Date applied';
  const appliedValue = '09 May 2022'
  const proofOfIdHeader = 'Proof of ID';
  const proofOfIdValue = 'ImageName.jpg (opens in new window)'
  const proofOfIdView = 'View';
  const proofOfIdViewLink = '/media-account-review/image?imageId=12345&applicantId=1234'
  const approveButtonText = 'Approve application';
  const rejectButtonText = 'Reject application';

  const dummyApplication = {
    "id": "1234",
    "fullName": "Test Name",
    "email": "a@b.com",
    "employer": "employer",
    "image": "12345",
    "imageName": "ImageName.jpg",
    "requestDate": "2022-05-09T00:00:01",
    "status": "PENDING",
    "statusDate": "2022-05-09T00:00:01"
  }

  sinon.stub(AccountManagementRequests.prototype, 'getMediaApplicationById').returns(dummyApplication);

  let htmlRes: Document;
  //let formElements: HTMLElement;

  describe('Media Account Review Page', () => {

    beforeAll(async () => {
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
        //formElements = htmlRes.getElementById('form-wrapper');
      });
    });

    it('should display header', () => {
      const header = htmlRes.getElementsByClassName(headingClass);
      expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
    });

    it('should display name header', () => {
      const header = htmlRes.getElementsByClassName(tableHeader);
      expect(header[0].innerHTML).contains(nameHeader, 'Could not find the name header');
    });

    it('should display name value', () => {
      const value = htmlRes.getElementsByClassName(tableCell);
      expect(value[0].innerHTML).contains(nameValue, 'Could not find the name value');
    });

    it('should display email header', () => {
      const header = htmlRes.getElementsByClassName(tableHeader);
      expect(header[1].innerHTML).contains(emailHeader, 'Could not find the email header');
    });

    it('should display email value', () => {
      const value = htmlRes.getElementsByClassName(tableCell);
      expect(value[2].innerHTML).contains(emailValue, 'Could not find the email value');
    });

    it('should display employer header', () => {
      const header = htmlRes.getElementsByClassName(tableHeader);
      expect(header[2].innerHTML).contains(employerHeader, 'Could not find the employer header');
    });

    it('should display employer value', () => {
      const value = htmlRes.getElementsByClassName(tableCell);
      expect(value[4].innerHTML).contains(employerValue, 'Could not find the employer value');
    });

    it('should display date applied header', () => {
      const header = htmlRes.getElementsByClassName(tableHeader);
      expect(header[3].innerHTML).contains(appliedHeader, 'Could not find the date applied header');
    });

    it('should display date applied value', () => {
      const value = htmlRes.getElementsByClassName(tableCell);
      expect(value[6].innerHTML).contains(appliedValue, 'Could not find the date applied value');
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

    it('should display approve button', () => {
      const button = htmlRes.getElementsByTagName(buttonTag);
      expect(button[0].innerHTML).contains(approveButtonText, 'Could not find the approve button text');
    });

    it('should display reject button', () => {
      const button = htmlRes.getElementsByTagName(buttonTag);
      expect(button[1].innerHTML).contains(rejectButtonText, 'Could not find the reject button text');
    });

  });
});
