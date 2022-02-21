import request from 'supertest';
import {app} from '../../../main/app';
import {expect} from 'chai';
import {request as expressRequest} from 'express';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import {CourtRequests} from '../../../main/resources/requests/courtRequests';

const PAGE_URL = '/manual-upload';
const headingClass = 'govuk-heading-xl';
const insetTextClass = 'govuk-inset-text';
const formGroupClass = 'govuk-form-group';
const fieldSetClass = 'govuk-fieldset';
const dateInputClass = 'govuk-date-input';

const expectedHeader = 'Manual upload';
const expectedFileQuestion = 'Manually upload a JSON, CSV, PDF, Word, HTM or HTML file, max size 2MB';
const expectedFileInputType = 'file';
const expectedCourtNameQuestion = 'Court name';
const expectedCourtNameContainer = 'search-input-container';
const expectedListType = 'List type';
const expectedHearingDates = 'Hearing start date';
const expectedDisplayDates = 'Display file from';
const expectedClassification = 'Available to';
const expectedLanguage = 'Language';
const buttonText = 'Continue';

let htmlRes: Document;
let formElements: HTMLElement;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);
const mockBodyData = {
  'input-autocomplete': '',
  listType: 'SJP_PUBLIC_LIST',
  judgementType: 'SJP_MEDIA_REGISTER',
  'content-date-from-day': '',
  'content-date-from-month': '',
  'content-date-from-year': '',
  classification: 'PUBLIC',
  language: 'ENGLISH',
  'display-date-from-day': '',
  'display-date-from-month': '',
  'display-date-from-year': '',
  'display-date-to-day': '',
  'display-date-to-month': '',
  'display-date-to-year': '',
};
sinon.stub(expressRequest, 'isAuthenticated').returns(true);
sinon.stub(CourtRequests.prototype, 'getAllCourts').returns(courtData);

describe('Manual upload page', () => {
  describe('on GET', () => {
    beforeAll(async () => {
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        formElements = htmlRes.getElementById('form-wrapper');
      });
    });

    it('should display header', () => {
      const header = htmlRes.getElementsByClassName(headingClass);
      expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
    });

    it('should contain file upload question inset', () => {
      const insetFileUpload = htmlRes.getElementsByClassName(insetTextClass);
      expect(insetFileUpload[0].innerHTML).contains(expectedFileQuestion, 'Could not find file upload');
      expect(insetFileUpload[0].getElementsByTagName('input')[0].getAttribute('type')).equal(expectedFileInputType, 'Could not find file upload type');
    });

    it('should display court name input', () => {
      const courtName = formElements.getElementsByClassName(formGroupClass)[0];
      expect(courtName.innerHTML).contains(expectedCourtNameQuestion, 'Could not find court name');
      expect(courtName.innerHTML).contains(expectedCourtNameContainer, 'Could not find court name container');
    });

    it('should display sub list type question', () => {
      const listType = formElements.getElementsByClassName(insetTextClass)[0].querySelector('#list-question');
      expect(listType.innerHTML).contains(expectedListType, 'Could not find inset list type');
    });

    it('should display content date question', () => {
      const contentDate = formElements.getElementsByClassName(insetTextClass)[0].getElementsByClassName(fieldSetClass)[0];
      expect(contentDate.innerHTML).contains(expectedHearingDates, 'Could not find inset content date question');
      expect(contentDate.getElementsByClassName(dateInputClass).length).equals(1, 'Could not find inset content date');
    });

    it('should display classification question', () => {
      const classification = formElements.getElementsByClassName(formGroupClass)[8];
      expect(classification.innerHTML).contains(expectedClassification, 'Could not find classification question');
    });

    it('should display language question', () => {
      const language = formElements.getElementsByClassName(formGroupClass)[9];
      expect(language.innerHTML).contains(expectedLanguage, 'Could not find language question');
    });

    it('should display display date question', () => {
      const displayDate = formElements.getElementsByClassName(fieldSetClass)[1];
      expect(displayDate.innerHTML).contains(expectedDisplayDates, 'Could not find inset content date question');
      expect(displayDate.getElementsByClassName(dateInputClass).length).equals(2, 'Could not find inset content date');
    });

    it('should display continue button', () => {
      const button = htmlRes.getElementsByTagName('button')[0];
      expect(button.innerHTML).contains(buttonText, 'Could not find continue button');
    });
  });

  describe('on POST', () => {
    beforeAll(async () => {
      app.request['file'] = {
        size: 2000001,
        originalname: 'too_large_file.pdf',
      };
      await request(app).post(PAGE_URL).send(mockBodyData).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        formElements = htmlRes.getElementById('form-wrapper');
      });
    });

    it('should display file too large error', () => {
      const fileError = htmlRes.getElementById('manual-file-upload-error');
      expect(fileError.innerHTML).contains('File too large, please upload file smaller than 2MB', 'Could not find file error');
    });

    it('should display court error', () => {
      const errorMessage = htmlRes.getElementsByClassName('govuk-error-message');
      expect(errorMessage[1].innerHTML).contains('Court name must be three characters or more', 'Could not find court error');
    });

    it('should display hearing date error', () => {
      const errorMessage = htmlRes.getElementsByClassName('govuk-error-message');
      expect(errorMessage[2].innerHTML).contains('Please enter a valid date', 'Could not find hearing date error');
    });

    it('should display file from date error', () => {
      const errorMessage = htmlRes.getElementsByClassName('govuk-error-message');
      expect(errorMessage[3].innerHTML).contains('Please enter a valid date', 'Could not find display file date error');
    });
  });
});
