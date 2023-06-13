import { app } from '../../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import { ListDownloadService } from '../../../main/service/listDownloadService';
import { request as expressRequest } from 'express';

const PAGE_URL = '/list-download-files?artefactId=abc';
let htmlRes: Document;

sinon.stub(ListDownloadService.prototype, 'generateFiles').resolves({});
const getFileSizeStub = sinon.stub(ListDownloadService.prototype, 'getFileSize');
getFileSizeStub.withArgs('abc', 'pdf').returns('1.1MB');
getFileSizeStub.withArgs('abc', 'xlsx').returns('25.2KB');

expressRequest['user'] = { roles: 'VERIFIED' };

describe('List Download Files Page', () => {
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
        expect(bodyText[1].innerHTML).contains('Download this PDF (1.1MB) to your device', 'Body text does not match');
        expect(bodyText[2].innerHTML).contains('govuk-link', 'Could not find link');
        expect(bodyText[2].innerHTML).contains(
            'Download this Microsoft Excel spreadsheet (25.2KB) to your device',
            'Body text does not match'
        );
    });
});
