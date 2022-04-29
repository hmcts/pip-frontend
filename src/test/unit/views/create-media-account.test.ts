import { app } from '../../../main/app';
import { expect } from 'chai';
import request from 'supertest';

const PAGE_URL = '/create-media-account';
const errorClassList = 'govuk-input--error';
let htmlRes: Document;

describe('Create Media Account page', () => {
  describe('without errors render', () => {
    beforeAll(async () => {
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display correct title', () => {
      const header = htmlRes.getElementsByClassName('govuk-heading-l');
      expect(header[0].innerHTML)
        .contains('Create a court and tribunal hearing account', 'Could not find correct value in the title');
    });

    it('should display correct retention hint', () => {
      const hint = htmlRes.getElementsByClassName('govuk-hint')[0];
      expect(hint.innerHTML)
        .contains('We will retain the personal information you enter here to manage your user account and our service.'
          , 'Could not find correct value in the hint');
    });

    it('should display full name input', () => {
      const fullNameLabel = htmlRes.getElementsByClassName('govuk-label')[0];
      const input = htmlRes.getElementById('fullName');
      expect(fullNameLabel.innerHTML).contains('Full name', 'Could not find full name label');
      expect(input.getAttribute('name')).equals('fullName', 'Could not find fullName input');
    });

    it('should display email input', () => {
      const emailLabel = htmlRes.getElementsByClassName('govuk-label')[1];
      const input = htmlRes.getElementById('emailAddress');
      const hint = htmlRes.getElementsByClassName('govuk-hint')[1];
      expect(emailLabel.innerHTML).contains('Email address', 'Could not find email label');
      expect(hint.innerHTML).contains('We\'ll only use this to contact you about your account and this service.', 'Could not find email hint');
      expect(input.getAttribute('name')).equals('emailAddress', 'Could not find emailAddress input');
      expect(input.getAttribute('type')).equals('email', 'Could not correct input type');
    });

    it('should display employer input', () => {
      const employerLabel = htmlRes.getElementsByClassName('govuk-label')[2];
      const input = htmlRes.getElementById('employer');
      expect(employerLabel.innerHTML).contains('Employer', 'Could not find employer label');
      expect(input.getAttribute('name')).equals('employer', 'Could not find employer input');
    });

    it('should contain image upload', () => {
      const imageUpload = htmlRes.getElementById('file-upload');
      expect(imageUpload.getAttribute('type')).equals('file', 'Could not find image upload');
      expect(htmlRes.getElementsByClassName('govuk-label')[3].innerHTML).contains('Must be a jpg, pdf, png, or tiff file', 'Could not find image upload label');
    });

    it('should display clear photo paragraph', () => {
      const message = htmlRes.getElementsByClassName('govuk-body')[0];
      expect(message.innerHTML).contains('Upload a clear photo of your UK Press Card or work ID', 'Could not find clear photo message');
    });

    it('should display usage paragraph', () => {
      const message = htmlRes.getElementsByClassName('govuk-hint')[2];
      expect(message.innerHTML).contains('We will only use this to confirm your identity for this service, ' +
        'and will delete upon approval or rejection of your request', 'Could not find clear photo message');
    });

    it('should display continue button', () => {
      const button = htmlRes.getElementsByTagName('button')[0];
      expect(button.innerHTML).contains('Continue', 'Could not find continue button');
    });
  });

  describe('with errors', () => {
    beforeAll(async () => {
      await request(app).post(PAGE_URL).send({fullName: '', emailAddress: '', employer: '', 'file-upload': ''}).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display error dialog', () => {
      const dialog = htmlRes.getElementsByClassName('govuk-error-summary');
      expect(dialog[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML)
        .contains('There is a problem', 'Could not find error dialog title');
    });

    it('should display error messages in th the dialog', () => {
      const list = htmlRes.getElementsByClassName(' govuk-error-summary__list')[0];
      const listItems = list.getElementsByTagName('a');
      expect(listItems.length).to.equal(4, 'Could not find all error messages');
      expect(listItems[0].innerHTML).contains('Enter your full name', 'Could not find name error');
      expect(listItems[1].innerHTML).contains('Enter your email address', 'Could not find email error');
      expect(listItems[2].innerHTML).contains('Enter your employer', 'Could not find employer error');
      expect(listItems[3].innerHTML).contains('Select a file to upload', 'Could not find file error');
    });

    it('should display name error message', () => {
      const errorMessage = htmlRes.getElementsByClassName('govuk-error-message');
      const nameInput = htmlRes.getElementById('fullName');
      expect(errorMessage[0].innerHTML).contains('Enter your full name', 'Could not find name error message');
      expect(nameInput.classList.contains(errorClassList)).to.be.true;
    });

    it('should display email error message', () => {
      const errorMessage = htmlRes.getElementsByClassName('govuk-error-message');
      const nameInput = htmlRes.getElementById('emailAddress');
      expect(errorMessage[1].innerHTML).contains('Enter your email address', 'Could not find email error message');
      expect(nameInput.classList.contains(errorClassList)).to.be.true;
    });

    it('should display employer error message', () => {
      const errorMessage = htmlRes.getElementsByClassName('govuk-error-message');
      const nameInput = htmlRes.getElementById('employer');
      expect(errorMessage[2].innerHTML).contains('Enter your employer', 'Could not find employer error message');
      expect(nameInput.classList.contains(errorClassList)).to.be.true;
    });

    it('should display image upload error message', () => {
      const errorMessage = htmlRes.getElementsByClassName('govuk-error-message');
      expect(errorMessage[3].innerHTML).contains('Select a file to upload', 'Could not find image upload error message');
    });
  });
});
