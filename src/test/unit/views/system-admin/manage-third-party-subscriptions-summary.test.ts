import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';

const userId = '123';
const PAGE_URL = '/manage-third-party-subscriptions-summary';

const listTypeSensitivityCookie = {
    CIVIL_DAILY_CAUSE_LIST: 'Public',
    FAMILY_DAILY_CAUSE_LIST: 'Private',
    SJP_PRESS_LIST: 'Classified',
};

app.request['user'] = {
    roles: 'SYSTEM_ADMIN',
};

app.request['cookies'] = {
    listTypeSensitivityCookie: JSON.stringify(listTypeSensitivityCookie),
};

let htmlRes: Document;

describe('Manage third party subscriptions summary', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL + `?userId=${userId}`)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains('Manage third-party subscriptions summary');
    });

    it('should display page header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains('Confirm third-party subscriptions');
    });

    it('should display correct table headers', () => {
        const tableHeader = htmlRes.getElementsByClassName('govuk-table__header');
        expect(tableHeader[0].innerHTML).contains('List type');
        expect(tableHeader[1].innerHTML).contains('Sensitivity');
    });

    it('should display the correct table cells', () => {
        const tableCells = htmlRes.getElementsByClassName('govuk-table__cell');

        expect(tableCells.length).equals(6);
        expect(tableCells[0].innerHTML).contains('Civil Daily Cause List');
        expect(tableCells[1].innerHTML).contains('Public');
        expect(tableCells[2].innerHTML).contains('Family Daily Cause List');
        expect(tableCells[3].innerHTML).contains('Private');
        expect(tableCells[4].innerHTML).contains('Single Justice Procedure Press List (Full List)');
        expect(tableCells[5].innerHTML).contains('Classified');
    });

    it('should display the confirm button', () => {
        const button = htmlRes.getElementsByClassName('govuk-button');
        expect(button[0].innerHTML).contains('Confirm');
    });
});
