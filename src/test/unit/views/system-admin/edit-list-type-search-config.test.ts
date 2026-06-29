import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../main/app';
import sinon from 'sinon';
import { request as expressRequest } from 'express';
import { PublicationService } from '../../../../main/service/PublicationService';

const PAGE_URL = '/edit-list-type-search-config?listType=SJP_PUBLIC_LIST';

const headingClass = 'govuk-heading-l';
const labelClass = 'govuk-label';

expressRequest['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };

sinon.stub(PublicationService.prototype, 'getListSearchConfigByListType').resolves({
    caseNumberFieldName: 'caseNumber',
    caseNameFieldName: 'caseName',
});

sinon.stub(PublicationService.prototype, 'getListTypes').returns(
    new Map([
        ['SJP_PUBLIC_LIST', { friendlyName: 'SJP Public List', isHidden: false }],
        [
            'FAMILY_DAILY_CAUSE_LIST',
            { friendlyName: 'Family Daily Cause List', isHidden: true, url: 'family-daily-cause-list' },
        ],
        [
            'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
            {
                friendlyName: 'Civil and Family Daily Cause List',
                isHidden: true,
                url: 'civil-and-family-daily-cause-list',
            },
        ],
    ]) as any
);

describe('Edit list type search config page', () => {
    let htmlRes: Document;

    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display the correct header', () => {
        const heading = htmlRes.getElementsByClassName(headingClass);
        expect(heading[0].innerHTML).contains(
            'Configure list type search fields for SJP Public List',
            'Header does not match'
        );
    });

    it('should display the case number field label', () => {
        const labels = htmlRes.getElementsByClassName(labelClass);
        expect(labels[0].innerHTML).contains('Case number JSON field name', 'Case number label does not match');
    });

    it('should display the case name field label', () => {
        const labels = htmlRes.getElementsByClassName(labelClass);
        expect(labels[1].innerHTML).contains('Case name JSON field name', 'Case name label does not match');
    });

    it('should display input with pre-populated case number value', () => {
        const input = htmlRes.getElementById('caseNumberFieldName') as HTMLInputElement;
        expect(input.value).to.equal('caseNumber', 'Case number field value does not match');
    });

    it('should display input with pre-populated case name value', () => {
        const input = htmlRes.getElementById('caseNameFieldName') as HTMLInputElement;
        expect(input.value).to.equal('caseName', 'Case name field value does not match');
    });

    it('should have the correct form action', () => {
        const form = htmlRes.getElementsByTagName('form')[0];
        expect(form.getAttribute('action')).to.equal(
            'edit-list-type-search-config?listType=SJP_PUBLIC_LIST',
            'Form action does not match'
        );
    });

    it('should not display error summary', () => {
        const errorSummary = htmlRes.getElementsByClassName('govuk-error-summary');
        expect(errorSummary.length).to.equal(0, 'Error summary should not be displayed');
    });
});
