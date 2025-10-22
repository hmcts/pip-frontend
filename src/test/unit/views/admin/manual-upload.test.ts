import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { LocationRequests } from '../../../../main/resources/requests/LocationRequests';
import { request as expressRequest } from 'express';

const PAGE_URL = '/manual-upload';
const headingClass = 'govuk-heading-xl';
const insetTextClass = 'govuk-inset-text';
const formGroupClass = 'govuk-form-group';
const fieldSetClass = 'govuk-fieldset';
const dateInputClass = 'govuk-date-input';

const expectedHeader = 'Manual upload';
const expectedFileQuestion = 'Manually upload a csv, doc, docx, htm, html, json, or pdf file, max size 2MB';
const expectedNonStrategicFileQuestion = 'Manually upload a excel file (.xlsx), max size 2MB';
const expectedFileInputType = 'file';
const expectedCourtNameQuestion = 'Court name';
const expectedCourtNameContainer = 'search-input-container';
const expectedListType = 'List type';
const expectedHearingDates = 'Hearing start date';
const expectedDisplayDateFrom = 'Display file from';
const expectedDisplayDateTo = 'Display file to';
const expectedClassification = 'Sensitivity';
const expectedLanguage = 'Language';
const buttonText = 'Continue';
const standardListType = 'SJP_PUBLIC_LIST';
const nonStrategicListType = 'WPAFCC_WEEKLY_HEARING_LIST';

let htmlRes: Document;
let formElements: HTMLElement;

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);
const mockBodyData = {
    'input-autocomplete': '',
    listType: 'SJP_PUBLIC_LIST',
    'content-date-from-day': '',
    'content-date-from-month': '',
    'content-date-from-year': '',
    classification: '',
    language: 'ENGLISH',
    'display-date-from-day': '',
    'display-date-from-month': '',
    'display-date-from-year': '',
    'display-date-to-day': '',
    'display-date-to-month': '',
    'display-date-to-year': '',
};

expressRequest['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

sinon.stub(LocationRequests.prototype, 'getAllLocations').returns(courtData);

describe('Manual upload page', () => {
    describe('on GET', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .set('Cookie', ['formCookie={"listType":"SJP_PUBLIC_LIST"}'])
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                    htmlRes.getElementById('branch-bar').remove();
                    formElements = htmlRes.getElementById('form-wrapper');
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains(
                'Upload - Manual Upload - Court and Tribunal Hearings - GOV.UK',
                'Could not find the title'
            );
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
        });

        it('should contain file upload question inset', () => {
            const insetFileUpload = htmlRes.getElementsByClassName(insetTextClass);
            expect(insetFileUpload[0].innerHTML).contains(expectedFileQuestion, 'Could not find file upload');
            expect(insetFileUpload[0].getElementsByTagName('input')[0].getAttribute('type')).equal(
                expectedFileInputType,
                'Could not find file upload type'
            );
        });

        it('should display court name input', () => {
            const courtName = formElements.getElementsByClassName(formGroupClass)[0];
            expect(courtName.innerHTML).contains(expectedCourtNameQuestion, 'Could not find court name');
            expect(courtName.innerHTML).contains(expectedCourtNameContainer, 'Could not find court name container');
        });

        it('should display sub list type question', () => {
            const listType = formElements.getElementsByClassName(insetTextClass)[0].querySelector('#list-question');
            expect(listType.innerHTML).contains(expectedListType, 'Could not find list type question');
        });

        it('sub list should contain a standard list type', () => {
            const listType = formElements.getElementsByClassName(insetTextClass)[0].querySelector('#list-question');
            expect(listType.innerHTML).contains(standardListType, 'Could not find standard list type');
        });

        it('sub list should have list type selected', () => {
            const optionElement = formElements.querySelector("option[value='SJP_PUBLIC_LIST']");
            expect(optionElement.getAttribute('selected')).to.not.be.null;
        });

        it('should display content date question', () => {
            const contentDate = formElements
                .getElementsByClassName(insetTextClass)[0]
                .getElementsByClassName(fieldSetClass)[0];
            expect(contentDate.innerHTML).contains(expectedHearingDates, 'Could not find inset content date question');
            expect(contentDate.getElementsByClassName(dateInputClass).length).equals(
                1,
                'Could not find inset content date'
            );
        });

        it('should display classification question', () => {
            const classification = formElements.getElementsByClassName(formGroupClass)[7];
            expect(classification.innerHTML).contains(expectedClassification, 'Could not find classification question');
        });

        it('should display language question', () => {
            const language = formElements.getElementsByClassName(formGroupClass)[8];
            expect(language.innerHTML).contains(expectedLanguage, 'Could not find language question');
        });

        it('should display display date question', () => {
            const displayDateFrom = formElements.getElementsByClassName(fieldSetClass)[1];
            const displayDateTo = formElements.getElementsByClassName(fieldSetClass)[2];
            expect(displayDateFrom.innerHTML).contains(
                expectedDisplayDateFrom,
                'Could not find inset content date question'
            );
            expect(displayDateTo.innerHTML).contains(
                expectedDisplayDateTo,
                'Could not find inset content date question'
            );
        });

        it('should display continue button', () => {
            const button = htmlRes.getElementsByTagName('button')[0];
            expect(button.innerHTML).contains(buttonText, 'Could not find continue button');
        });

        it('should display page help heading', () => {
            const heading = htmlRes.getElementsByTagName('h2')[1];
            expect(heading.innerHTML).contains('Page Help', 'Could not find page help heading');
        });

        it('should display the lists heading', () => {
            const heading = htmlRes.getElementsByTagName('h3')[0];
            expect(heading.innerHTML).contains('Lists', 'Could not find lists heading');
        });

        it('should display the available to heading', () => {
            const heading = htmlRes.getElementsByTagName('h3')[1];
            expect(heading.innerHTML).contains('Sensitivity', 'Could not find available to heading');
        });

        it('should display the public heading', () => {
            const heading = htmlRes.getElementsByTagName('h3')[2];
            expect(heading.innerHTML).contains('Public', 'Could not find public heading');
        });

        it('should display the private heading', () => {
            const heading = htmlRes.getElementsByTagName('h3')[3];
            expect(heading.innerHTML).contains('Private', 'Could not find private heading');
        });

        it('should display the classified - heading', () => {
            const heading = htmlRes.getElementsByTagName('h3')[4];
            expect(heading.innerHTML).contains('Classified', 'Could not find classified heading');
        });

        it('should display the display from heading', () => {
            const heading = htmlRes.getElementsByTagName('h3')[5];
            expect(heading.innerHTML).contains('Display from', 'Could not find display from heading');
        });

        it('should display the display to heading', () => {
            const heading = htmlRes.getElementsByTagName('h3')[6];
            expect(heading.innerHTML).contains('Display to', 'Could not find display to heading');
        });

        it('should display the warning banner', () => {
            const banner = htmlRes.getElementsByClassName('govuk-callout')[0];
            const warningHeader = htmlRes.getElementsByTagName('h2')[0];
            const warningText = htmlRes.getElementsByClassName('govuk-warning-text__text')[0];

            expect(banner).to.exist;
            expect(warningHeader.innerHTML).contains('Warning', 'Could not find warning header');
            expect(warningText.innerHTML).contains(
                'Prior to upload you must ensure the file is suitable for publication ' +
                    'e.g. redaction of personal data has been done during the production of this file.',
                'Could not find warning text'
            );
        });
    });

    describe('on GET for non-strategic publication', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL + '?non-strategic=true')
                .set('Cookie', ['formCookie={"listType":"SJP_PUBLIC_LIST"}'])
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                    htmlRes.getElementById('branch-bar').remove();
                    formElements = htmlRes.getElementById('form-wrapper');
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains(
                'Upload excel file - Excel file upload - Court and Tribunal Hearings - GOV.UK',
                'Could not find the header'
            );
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).contains('Excel File Upload', 'Could not find the header');
        });

        it('should contain file upload question inset', () => {
            const insetFileUpload = htmlRes.getElementsByClassName(insetTextClass);
            expect(insetFileUpload[0].innerHTML).contains(
                expectedNonStrategicFileQuestion,
                'Could not find file upload'
            );
            expect(insetFileUpload[0].getElementsByTagName('input')[0].getAttribute('type')).equal(
                expectedFileInputType,
                'Could not find file upload type'
            );
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

        it('sub list should have empty selected', () => {
            const optionElement = formElements.querySelector("option[value='EMPTY']");
            expect(optionElement.getAttribute('selected')).to.not.be.null;
        });

        it('should display the warning banner', () => {
            const banner = htmlRes.getElementsByClassName('govuk-callout')[0];
            const warningHeader = htmlRes.getElementsByTagName('h2')[0];
            const warningText = htmlRes.getElementsByClassName('govuk-warning-text__text')[0];

            expect(banner).to.exist;
            expect(warningHeader.innerHTML).contains('Warning', 'Could not find warning header');
            expect(warningText.innerHTML).contains(
                'Prior to upload you must ensure the file is suitable for publication ' +
                    'e.g. redaction of personal data has been done during the production of this file.',
                'Could not find warning text'
            );
        });

        it('sub list should contain a non-strategic list type', () => {
            const listType = formElements.getElementsByClassName(insetTextClass)[0].querySelector('#list-question');
            expect(listType.innerHTML).contains(nonStrategicListType, 'Could not find non-strategic list type');
        });
    });

    describe('on POST', () => {
        beforeAll(async () => {
            app.request['file'] = {
                size: 2000001,
                originalname: 'too_large_file.pdf',
            };
            await request(app)
                .post(PAGE_URL)
                .send(mockBodyData)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                    formElements = htmlRes.getElementById('form-wrapper');
                });
        });

        it('should display file too large error', () => {
            const fileError = htmlRes.getElementById('manual-file-upload-error');
            const errorSummaryTitle = htmlRes.getElementsByClassName('govuk-error-summary__title');
            const errorSummaryList = htmlRes.getElementsByClassName('govuk-error-summary__list');

            expect(fileError.innerHTML).contains(
                'File too large, please upload file smaller than 2MB',
                'Could not find file error'
            );
            expect(errorSummaryTitle[0].innerHTML).contains('There is a problem', 'Error summary title does not match');
            expect(errorSummaryList[0].innerHTML).contains(
                'File too large, please upload file smaller than 2MB',
                'Error summary list does not match'
            );
        });

        it('sub list should have list type selected', () => {
            const optionElement = formElements.querySelector("option[value='SJP_PUBLIC_LIST']");
            expect(optionElement.getAttribute('selected')).to.not.be.null;
        });

        it('should display court error', () => {
            const errorMessage = htmlRes.getElementsByClassName('govuk-error-message');
            const errorSummaryTitle = htmlRes.getElementsByClassName('govuk-error-summary__title');
            const errorSummaryList = htmlRes.getElementsByClassName('govuk-error-summary__list');

            expect(errorMessage[1].innerHTML).contains(
                'Court name must be three characters or more',
                'Could not find court error'
            );
            expect(errorSummaryTitle[0].innerHTML).contains('There is a problem', 'Error summary title does not match');
            expect(errorSummaryList[0].innerHTML).contains(
                'Court name must be three characters or more',
                'Error summary list does not match'
            );
        });

        it('should display hearing date error', () => {
            const errorMessage = htmlRes.getElementsByClassName('govuk-error-message');
            const errorSummaryTitle = htmlRes.getElementsByClassName('govuk-error-summary__title');
            const errorSummaryList = htmlRes.getElementsByClassName('govuk-error-summary__list');

            expect(errorMessage[2].innerHTML).contains(
                'Please enter a valid hearing start date',
                'Could not find hearing date error'
            );
            expect(errorSummaryTitle[0].innerHTML).contains('There is a problem', 'Error summary title does not match');
            expect(errorSummaryList[0].innerHTML).contains(
                'Please enter a valid hearing start date',
                'Error summary list does not match'
            );
        });

        it('should display sensitivity error', () => {
            const errorMessage = htmlRes.getElementsByClassName('govuk-error-message');
            const errorSummaryTitle = htmlRes.getElementsByClassName('govuk-error-summary__title');
            const errorSummaryList = htmlRes.getElementsByClassName('govuk-error-summary__list');

            expect(errorMessage[3].innerHTML).contains(
                'Please select a sensitivity',
                'Could not find sensitivity error'
            );
            expect(errorSummaryTitle[0].innerHTML).contains('There is a problem', 'Error summary title does not match');
            expect(errorSummaryList[0].innerHTML).contains(
                'Please select a sensitivity',
                'Error summary list does not match'
            );
        });

        it('should display file from date error', () => {
            const errorMessage = htmlRes.getElementsByClassName('govuk-error-message');
            const errorSummaryTitle = htmlRes.getElementsByClassName('govuk-error-summary__title');
            const errorSummaryList = htmlRes.getElementsByClassName('govuk-error-summary__list');

            expect(errorMessage[4].innerHTML).contains(
                'Please enter a valid display file from date',
                'Could not find display file date error'
            );
            expect(errorSummaryTitle[0].innerHTML).contains('There is a problem', 'Error summary title does not match');
            expect(errorSummaryList[0].innerHTML).contains(
                'Please enter a valid display file from date',
                'Error summary list does not match'
            );
        });
    });
});
