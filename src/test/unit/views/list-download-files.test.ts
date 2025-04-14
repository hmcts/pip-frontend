import { app } from '../../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import { ListDownloadService } from '../../../main/service/ListDownloadService';
import { request as expressRequest } from 'express';
import { PublicationService } from '../../../main/service/PublicationService';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';

const PAGE_URL = '/list-download-files?artefactId=abc';
const PAGE_URL_WITH_PDF_ONLY = '/list-download-files?artefactId=def';
const PAGE_URL_WITH_EXCEL_ONLY = '/list-download-files?artefactId=ghi';
let htmlRes: Document;

const mockArtefact = {
    artefactId: 'abc',
    listType: 'SJP_PRESS_LIST',
    sensitivity: 'CLASSIFIED',
};

const mockArtefactForPdfOnly = {
    artefactId: 'def',
    listType: 'SJP_PRESS_LIST',
    sensitivity: 'CLASSIFIED',
};

const mockArtefactForExcelOnly = {
    artefactId: 'ghi',
    listType: 'SJP_PRESS_LIST',
    sensitivity: 'CLASSIFIED',
};

const getMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

getMetadataStub.withArgs('abc').resolves(mockArtefact);
getMetadataStub.withArgs('def').resolves(mockArtefactForPdfOnly);
getMetadataStub.withArgs('ghi').resolves(mockArtefactForExcelOnly);
sinon.stub(AccountManagementRequests.prototype, 'isAuthorised').resolves(true);
sinon.stub(ListDownloadService.prototype, 'getFile').resolves('abc');

const getFileSizeStub = sinon.stub(ListDownloadService.prototype, 'getFileSize');
getFileSizeStub.withArgs('abc', 'pdf', '123-456').returns('1.1MB');
getFileSizeStub.withArgs('abc', 'xlsx', '123-456').returns('25.2KB');
getFileSizeStub.withArgs('def', 'pdf', '123-456').returns('1.1MB');
getFileSizeStub.withArgs('def', 'xlsx', '123-456').returns(null);
getFileSizeStub.withArgs('ghi', 'pdf', '123-456').returns(null);
getFileSizeStub.withArgs('ghi', 'xlsx', '123-456').returns('25.2KB');

expressRequest['user'] = { roles: 'VERIFIED' };

describe('List Download Files Page', () => {
    describe('With PDF and Excel', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains('Download your file', 'Page title does not match');
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName('govuk-heading-l')[0];
            expect(header.innerHTML).contains('Download your file', 'Header does not match');
        });

        it('should display the body text', () => {
            const bodyText = htmlRes.getElementsByClassName('govuk-body');
            expect(bodyText[0].innerHTML).contains(
                'Save your file somewhere you can find it. You may need to print it or show it to someone later.',
                'Body text does not match'
            );
            expect(bodyText[3].innerHTML).contains(
                'If you have any questions, call 0300 303 0656.',
                'Body text does not match'
            );
        });

        it('should display the link', () => {
            const bodyText = htmlRes.getElementsByClassName('govuk-body');
            expect(bodyText[1].innerHTML).contains('govuk-link', 'Could not find link');

            expect(bodyText[1].innerHTML).contains(
                'Download this PDF (1.1MB) to your device',
                'Body text does not match'
            );
            expect(bodyText[2].innerHTML).contains('govuk-link', 'Could not find link');
            expect(bodyText[2].innerHTML).contains(
                'Download this Microsoft Excel spreadsheet (25.2KB) to your device',
                'Body text does not match'
            );
        });
    });

    describe('With PDF only', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL_WITH_PDF_ONLY)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display the link', () => {
            const bodyText = htmlRes.getElementsByClassName('govuk-body');
            expect(bodyText[1].innerHTML).contains('govuk-link', 'Could not find link');
            expect(bodyText[1].innerHTML).contains(
                'Download this PDF (1.1MB) to your device',
                'Body text does not match'
            );
            expect(bodyText[2].innerHTML).not.contains('govuk-link', 'Could find link');
        });
    });

    describe('With Excel only', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL_WITH_EXCEL_ONLY)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display the link', () => {
            const bodyText = htmlRes.getElementsByClassName('govuk-body');
            expect(bodyText[1].innerHTML).contains('govuk-link', 'Could not find link');
            expect(bodyText[1].innerHTML).contains(
                'Download this Microsoft Excel spreadsheet (25.2KB) to your device',
                'Body text does not match'
            );
            expect(bodyText[2].innerHTML).not.contains('govuk-link', 'Could find link');
        });
    });
});
