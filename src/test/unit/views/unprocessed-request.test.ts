import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';

const PAGE_URL = '/unprocessed-request';

let htmlRes: Document;

describe('Unprocessed Request Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(response => {
                htmlRes = new DOMParser().parseFromString(response.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(
            'Sorry, we were not able to process your request',
            'Page title does not match header'
        );
    });

    it('should display page header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains(
            'Sorry, we were not able to process your request',
            'Page header does not match'
        );
    });

    it('should display file format message', () => {
        const header = htmlRes.getElementsByClassName('govuk-body');
        expect(header[0].innerHTML).contains(
            'This could be because of the file format you have selected, you should save your file using another file format and try again.',
            'File format message does not match'
        );
    });

    it('should display CaTH service centre contact message', () => {
        const header = htmlRes.getElementsByClassName('govuk-body');
        expect(header[1].innerHTML).contains(
            'If the problem persists please contact the Courts and Tribunals Service centre on 0300 303 0656.',
            'CaTH service centre contact does not match'
        );
    });
});
