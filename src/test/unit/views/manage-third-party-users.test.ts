import request from 'supertest';
import { app } from '../../../main/app';
import { request as expressRequest } from 'express';
import { expect } from 'chai';
import { ThirdPartyService } from '../../../main/service/thirdPartyService';
import sinon from 'sinon';

describe('Manage third party users', () => {
    const PAGE_URL = '/manage-third-party-users';
    let htmlRes: Document;

    const headingClass = 'govuk-heading-l';
    const columnClass = 'govuk-table__header';
    const rowClass = 'govuk-table__row';
    const cellClass = 'govuk-table__cell';

    expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

    sinon.stub(ThirdPartyService.prototype, 'getThirdPartyAccounts').resolves([
        {
            userId: '1234-1234',
            provenanceUserId: 'ThisIsAName',
            roles: 'GENERAL_THIRD_PARTY',
            createdDate: '18th November 2022',
        },
        {
            userId: '2345-2345',
            provenanceUserId: 'ThisIsAnotherName',
            roles: 'GENERAL_THIRD_PARTY',
            createdDate: '20th November 2022',
        },
    ]);

    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains('Manage Third Party Users', 'Could not find the header');
    });

    it('should display name header', () => {
        const columns = htmlRes.getElementsByClassName(columnClass);
        expect(columns[0].innerHTML).contains('Name', 'Could not find the header');
    });

    it('should display role header', () => {
        const columns = htmlRes.getElementsByClassName(columnClass);
        expect(columns[1].innerHTML).contains('Role', 'Could not find the header');
    });

    it('should display created date header', () => {
        const columns = htmlRes.getElementsByClassName(columnClass);
        expect(columns[2].innerHTML).contains('Created Date', 'Could not find the header');
    });

    it('should contain three rows', () => {
        const rows = htmlRes.getElementsByClassName(rowClass);
        expect(rows.length).eq(3, 'Number of rows is incorrect');
    });

    it('row one should have the correct name', () => {
        const cells = htmlRes.getElementsByClassName(cellClass);
        expect(cells[0].innerHTML).contains('ThisIsAName', 'Row name is incorrect');
    });

    it('row one should have the correct role', () => {
        const cells = htmlRes.getElementsByClassName(cellClass);
        expect(cells[1].innerHTML).contains('GENERAL_THIRD_PARTY', 'Third party role is incorrect');
    });

    it('row one should have the correct created date', () => {
        const cells = htmlRes.getElementsByClassName(cellClass);
        expect(cells[2].innerHTML).contains('18th November 2022', 'Created date is incorrect');
    });

    it('row one should have the correct view text', () => {
        const cells = htmlRes.getElementsByClassName(cellClass);
        expect(cells[3].innerHTML).contains('View', 'View link does not have the correct text');
    });

    it('row one should have the correct view link', () => {
        const linkHref = htmlRes.getElementsByClassName(cellClass)[3].getElementsByTagName('a')[0].getAttribute('href');

        expect(linkHref).equals(
            '/manage-third-party-users/view?userId=' + '1234-1234',
            'View link does not have the correct text'
        );
    });
});
