import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';

const PAGE_URL = '/edit-list-type-search-config-summary';
const headingClass = 'govuk-heading-l';
const summaryKeyClass = 'govuk-summary-list__key';
const summaryValueClass = 'govuk-summary-list__value';
const summaryActionsClass = 'govuk-summary-list__actions';

const formData = {
    listType: 'SJP_PUBLIC_LIST',
    caseNumberFieldName: 'caseNumber',
    caseNameFieldName: 'caseName',
};

const formDataCreate = {
    ...formData,
    createConfig: 'true',
};

expressRequest['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };
expressRequest['cookies'] = { listSearchConfigCookie: JSON.stringify(formData) };

sinon.stub(PublicationService.prototype, 'createListSearchConfig').resolves(null);

describe('Edit list type search config summary page', () => {
    describe('with valid form data in cookie', () => {
        let htmlRes: Document;

        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display the correct heading', () => {
            const heading = htmlRes.getElementsByClassName(headingClass);
            expect(heading[0].innerHTML).contains('Summary', 'Heading does not match');
        });

        it('should display list type summary row key', () => {
            const keys = htmlRes.getElementsByClassName(summaryKeyClass);
            expect(keys[0].innerHTML).contains('List type', 'List type key does not match');
        });

        it('should display list type summary row value', () => {
            const values = htmlRes.getElementsByClassName(summaryValueClass);
            expect(values[0].innerHTML).contains('SJP_PUBLIC_LIST', 'List type value does not match');
        });

        it('should display case number field summary row key', () => {
            const keys = htmlRes.getElementsByClassName(summaryKeyClass);
            expect(keys[1].innerHTML).contains('Case number JSON field name', 'Case number key does not match');
        });

        it('should display case number field summary row value', () => {
            const values = htmlRes.getElementsByClassName(summaryValueClass);
            expect(values[1].innerHTML).contains('caseNumber', 'Case number value does not match');
        });

        it('should display case name field summary row key', () => {
            const keys = htmlRes.getElementsByClassName(summaryKeyClass);
            expect(keys[2].innerHTML).contains('Case name JSON field name', 'Case name key does not match');
        });

        it('should display case name field summary row value', () => {
            const values = htmlRes.getElementsByClassName(summaryValueClass);
            expect(values[2].innerHTML).contains('caseName', 'Case name value does not match');
        });

        it('should display the correct change link for case number field', () => {
            const actionCells = htmlRes.getElementsByClassName(summaryActionsClass);
            const link = actionCells[1].getElementsByTagName('a')[0];
            expect(link.getAttribute('href')).contains(
                'edit-list-type-search-config?listType=SJP_PUBLIC_LIST#caseNumberFieldName',
                'Case number change link href does not match'
            );
        });

        it('should display the correct change link for case name field', () => {
            const actionCells = htmlRes.getElementsByClassName(summaryActionsClass);
            const link = actionCells[2].getElementsByTagName('a')[0];
            expect(link.getAttribute('href')).contains(
                'edit-list-type-search-config?listType=SJP_PUBLIC_LIST#caseNameFieldName',
                'Case name change link href does not match'
            );
        });

        it('should not display error summary', () => {
            const errorSummary = htmlRes.getElementsByClassName('govuk-error-summary');
            expect(errorSummary.length).to.equal(0, 'Error summary should not be displayed');
        });
    });

    describe('when service fails on submit', () => {
        let htmlRes: Document;

        beforeAll(async () => {
            expressRequest['cookies'] = { listSearchConfigCookie: JSON.stringify(formDataCreate) };

            await request(app)
                .post(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display error summary title', () => {
            const errorSummary = htmlRes.getElementsByClassName('govuk-error-summary');
            expect(errorSummary[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML).contains(
                'There is a problem',
                'Could not find error summary title'
            );
        });

        it('should display error message', () => {
            const list = htmlRes.getElementsByClassName(' govuk-error-summary__list')[0];
            const listItems = list.getElementsByTagName('a');
            expect(listItems[0].innerHTML).contains(
                'Failed to create or update list type search configuration',
                'Could not find error message'
            );
        });
    });
});
