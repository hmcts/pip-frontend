import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { LocationRequests } from '../../../main/resources/requests/locationRequests';
import { request as expressRequest } from 'express';

const PAGE_URL = '/manual-reference-data-upload';
const headingClass = 'govuk-heading-xl';
const insetTextClass = 'govuk-inset-text';
const linkClass = 'govuk-link';

const expectedHeader = 'Reference manual data upload';
const expectedFileQuestion = 'Manually upload a csv file (saved as Comma-separated Values .csv), max size 2MB';
const expectedFileInputType = 'file';
const buttonText = 'Continue';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);
const mockBodyData = {
    'input-autocomplete': '',
};

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

sinon.stub(LocationRequests.prototype, 'getAllLocations').returns(courtData);

describe('Reference Data Manual upload page', () => {
    describe('on GET', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                    htmlRes.getElementById('branch-bar').remove();
                });
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

        it('should display continue button', () => {
            const button = htmlRes.getElementsByTagName('button')[0];
            expect(button.innerHTML).contains(buttonText, 'Could not find continue button');
        });

        it('should display the warning banner', () => {
            const banner = htmlRes.getElementsByClassName('govuk-callout')[0];
            const warningHeader = htmlRes.getElementsByTagName('h1')[0];
            const warningText = htmlRes.getElementsByTagName('p')[1];

            expect(banner).to.exist;
            expect(warningHeader.innerHTML).contains('Warning', 'Could not find warning header');
            expect(warningText.innerHTML).contains(
                'Prior to upload you must ensure the file is suitable for location data upload e.g. file should be in correct formats.',
                'Could not find warning text'
            );
        });

        it('should display the download current reference data link', () => {
            const link = htmlRes.getElementsByClassName(linkClass);

            expect(link[2].innerHTML).to.equal('Download current reference data', 'Could not find download link');
            expect(link[2].outerHTML).contains('href="/manual-reference-data-download"', 'href not found');
        });
    });

    describe('on POST', () => {
        beforeAll(async () => {
            app.request['file'] = {
                size: 2000001,
                originalname: 'too_large_file.csv',
            };
            await request(app)
                .post(PAGE_URL)
                .send(mockBodyData)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display file too large error', () => {
            const fileError = htmlRes.getElementById('manual-reference-data-upload-error');
            expect(fileError.innerHTML).contains(
                'File too large, please upload file smaller than 2MB',
                'Could not find file error'
            );
        });
    });
});
