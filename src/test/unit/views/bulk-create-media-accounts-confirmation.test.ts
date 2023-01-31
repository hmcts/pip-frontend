import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import sinon from 'sinon';
import { FileHandlingService } from '../../../main/service/fileHandlingService';

const PAGE_URL = '/bulk-create-media-accounts-confirmation';
const fileName = 'fileName';
const mockData = { fileName: fileName, uploadFileName: fileName, file: '' };

app.request['cookies'] = { formCookie: JSON.stringify(mockData) };
app.request['user'] = {
    oid: '1',
    roles: 'SYSTEM_ADMIN',
};

const file = 'file';
const mockAccounts = [
    ['email', 'firstName', 'surname'],
    ['test1@test.com', 'firstName1', 'surname1'],
    ['test2@test.com', 'firstName2', 'surname2'],
];

sinon.stub(FileHandlingService.prototype, 'readFileFromRedis').resolves(file);
sinon.stub(FileHandlingService.prototype, 'readCsvToArray').returns(mockAccounts);

let htmlRes: Document;

describe('Bulk Create Media Accounts Confirmation Page', () => {
    describe('without error', () => {
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
            expect(pageTitle).contains('Create media accounts confirmation', 'Page title does not match');
        });

        it('should have correct header', () => {
            const heading = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(heading[0].innerHTML).contains('Create media accounts confirmation', 'Header does not match');
        });

        it('should display correct table headers', () => {
            const headerNames = htmlRes.getElementsByClassName('govuk-table__header');
            expect(headerNames[0].innerHTML).contains('Email', 'Table header does not match');
            expect(headerNames[1].innerHTML).contains('First Name', 'Table header does not match');
            expect(headerNames[2].innerHTML).contains('Surname', 'Table header does not match');
        });

        it('should display correct row values', () => {
            const tableRows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');
            expect(tableRows.length).equal(2, 'Incorrect table rows count');

            for (let i = 0; i < tableRows.length; i++) {
                const rowCells = tableRows[i].getElementsByClassName('govuk-table__cell');
                expect(rowCells[0].innerHTML).contains(mockAccounts[i + 1][0], 'Email does not match');
                expect(rowCells[1].innerHTML).contains(mockAccounts[i + 1][1], 'First name does not match');
                expect(rowCells[2].innerHTML).contains(mockAccounts[i + 1][2], 'Surname does not match');
            }
        });

        it('should display filter options', () => {
            const fieldsets = htmlRes.getElementsByClassName('govuk-fieldset')[0];
            expect(fieldsets.innerHTML).contains(
                'Are you sure you want to create these media accounts?',
                'Fieldset does not match'
            );
        });

        describe('with error', () => {
            beforeAll(async () => {
                await request(app)
                    .post(PAGE_URL)
                    .send()
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display error summary', () => {
                const dialog = htmlRes.getElementsByClassName('govuk-error-summary');
                expect(dialog[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML).contains(
                    'There is a problem',
                    'Could not find error dialog title'
                );
            });

            it('should display error messages in the summary', () => {
                const list = htmlRes.getElementsByClassName(' govuk-error-summary__list')[0];
                const listItems = list.getElementsByTagName('a');
                expect(listItems[0].innerHTML).contains('An option must be selected', 'Could not find error');
            });
        });
    });
});
