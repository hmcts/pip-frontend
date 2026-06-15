import request from 'supertest';
import { app } from '../../../../main/app';
import { request as expressRequest } from 'express';
import { expect } from 'chai';
import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';

describe('Manage list types', () => {
    const PAGE_URL = '/manage-list-types';
    let htmlRes: Document;

    const headingClass = 'govuk-heading-l';
    const columnClass = 'govuk-table__header';
    const rowClass = 'govuk-table__row';
    const cellClass = 'govuk-table__cell';

    expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

    sinon.stub(PublicationService.prototype, 'getListTypes').returns(
        new Map([
            ['SJP_PUBLIC_LIST', { friendlyName: 'SJP Public List', isHidden: false }],
            ['CIVIL_DAILY_CAUSE_LIST', { friendlyName: 'Civil Daily Cause List', isHidden: false }],
            ['FAMILY_DAILY_CAUSE_LIST', { friendlyName: 'Family Daily Cause List', isHidden: true, url: 'family-daily-cause-list' }],
            ['CIVIL_AND_FAMILY_DAILY_CAUSE_LIST', { friendlyName: 'Civil and Family Daily Cause List', isHidden: true, url: 'civil-and-family-daily-cause-list' }],
        ]) as any
    );

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
        expect(header[0].innerHTML).contains('Manage list types', 'Could not find the header');
    });

    it('should display name column header', () => {
        const columns = htmlRes.getElementsByClassName(columnClass);
        expect(columns[0].innerHTML).contains('Name', 'Could not find the name column header');
    });

    it('should contain three rows', () => {
        const rows = htmlRes.getElementsByClassName(rowClass);
        expect(rows.length).eq(3, 'Number of rows is incorrect');
    });

    it('row one should display the correct list type name', () => {
        const cells = htmlRes.getElementsByClassName(cellClass);
        expect(cells[0].innerHTML).contains('Civil Daily Cause List', 'Row two list type name is incorrect');
    });

    it('row one should display the manage link with correct text', () => {
        const cells = htmlRes.getElementsByClassName(cellClass);
        expect(cells[1].innerHTML).contains('Manage', 'Row one manage link text is incorrect');
    });

    it('row one should display the manage link with correct href', () => {
        const linkHref = htmlRes.getElementsByClassName(cellClass)[1].getElementsByTagName('a')[0].getAttribute('href');
        expect(linkHref).equals(
            'edit-list-type-search-config?listType=CIVIL_DAILY_CAUSE_LIST',
            'Row one manage link href is incorrect'
        );
    });

    it('row two should display the correct list type name', () => {
        const cells = htmlRes.getElementsByClassName(cellClass);
        expect(cells[2].innerHTML).contains('SJP Public List', 'Row one list type name is incorrect');

    });

    it('row two should display the manage link with correct href', () => {
        const linkHref = htmlRes.getElementsByClassName(cellClass)[3].getElementsByTagName('a')[0].getAttribute('href');
        expect(linkHref).equals(
            'edit-list-type-search-config?listType=SJP_PUBLIC_LIST',
            'Row two manage link href is incorrect'
        );
    });
});
