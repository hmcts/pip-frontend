import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/cookie-policy';
const titleClass = 'govuk-heading-l';
const headingClass = 'govuk-heading-m';
const tableClass = 'govuk-table';
const detailsClass = 'govuk-details__summary';
const listClass = 'govuk-list--bullet';
const radiosClass = 'govuk-radios__input';
const buttonClass = 'govuk-button';

let htmlRes: Document;

describe('Cookies page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display title', () => {
        const header = htmlRes.getElementsByClassName(titleClass);
        expect(header[0].innerHTML).contains('Cookies', 'Could not find the title');
    });

    it('should display the first heading', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains(
            'How cookies are used in the Courts and tribunal hearings service',
            'Could not find the first header'
        );
    });

    it('should display the second heading', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[1].innerHTML).contains('Change your cookie settings', 'Could not find the second header');
    });

    it('should display correct number of tables', () => {
        const tables = htmlRes.getElementsByClassName(tableClass);
        expect(tables.length).to.equal(6);
    });

    it('should display contact us for help details', () => {
        const details = htmlRes.getElementsByClassName(detailsClass)[0];
        expect(details).to.exist;
    });

    it('should display the correct number of lists', () => {
        const lists = htmlRes.getElementsByClassName(listClass);
        expect(lists.length).to.equal(3);
    });

    it('should have correct number of radios on the page', () => {
        const radios = htmlRes.getElementsByClassName(radiosClass);
        expect(radios.length).to.equal(4);
    });

    it('should have a button on the page', () => {
        const button = htmlRes.getElementsByClassName(buttonClass)[0];
        expect(button).to.exist;
    });
});
