import { app } from '../../../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';
import fs from 'fs';
import path from 'path';

const PAGE_URL = '/blob-view-subscription-resubmit-confirmation?artefactId=123';
app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };

let htmlRes: Document;
const summaryListRowClass = 'govuk-summary-list__row';
const summaryListRowKeyClass = 'govuk-summary-list__key';
const summaryListRowValueClass = 'govuk-summary-list__value';

const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metadata = JSON.parse(rawMetadata)[1];
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);
sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'Test court' });

describe('Blob explorer subscription re-submit confirmation page', () => {
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
        expect(pageTitle).equals('Blob Explorer - Confirm subscription re-submission - Court and Tribunal Hearings - GOV.UK', 'Page title does not match');
    });

    it('should have correct header', () => {
        const heading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(heading[0].innerHTML).contains('Confirm subscription re-submission', 'Header does not match');
    });

    it('should have the location name row in the summary list', () => {
        const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[0];
        const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
        const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

        expect(summaryListRow).to.exist;
        expect(rowKey.innerHTML).contains('Location Name', 'Could not find row key');
        expect(rowValue.innerHTML).contains('Test court', 'Could not find row value');
    });

    it('should have the publication type row in the summary list', () => {
        const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[1];
        const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
        const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

        expect(summaryListRow).to.exist;
        expect(rowKey.innerHTML).contains('Publication Type', 'Could not find row key');
        expect(rowValue.innerHTML).contains('General_publication', 'Could not find row value');
    });

    it('should have the list type row in the summary list', () => {
        const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[2];
        const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
        const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

        expect(summaryListRow).to.exist;
        expect(rowKey.innerHTML).contains('List Type', 'Could not find row key');
        expect(rowValue.innerHTML).contains('Single Justice Procedure Public List', 'Could not find row value');
    });

    it('should have the provenance row in the summary list', () => {
        const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[3];
        const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
        const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

        expect(summaryListRow).to.exist;
        expect(rowKey.innerHTML).contains('Provenance', 'Could not find row key');
        expect(rowValue.innerHTML).contains('prov2', 'Could not find row value');
    });

    it('should have the language row in the summary list', () => {
        const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[4];
        const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
        const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

        expect(summaryListRow).to.exist;
        expect(rowKey.innerHTML).contains('Language', 'Could not find row key');
        expect(rowValue.innerHTML).contains('English', 'Could not find row value');
    });

    it('should have the sensitivity row in the summary list', () => {
        const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[5];
        const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
        const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

        expect(summaryListRow).to.exist;
        expect(rowKey.innerHTML).contains('Sensitivity', 'Could not find row key');
        expect(rowValue.innerHTML).contains('Public', 'Could not find row value');
    });

    it('should have the content date row in the summary list', () => {
        const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[6];
        const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
        const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

        expect(summaryListRow).to.exist;
        expect(rowKey.innerHTML).contains('Content Date', 'Could not find row key');
        expect(rowValue.innerHTML).contains('14th February 2022 at 02:14 pm', 'Could not find row value');
    });

    it('should have the display from row in the summary list', () => {
        const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[7];
        const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
        const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

        expect(summaryListRow).to.exist;
        expect(rowKey.innerHTML).contains('Display From', 'Could not find row key');
        expect(rowValue.innerHTML).contains(' 14th February 2022 at 02:14 pm', 'Could not find row value');
    });

    it('should have the display to row in the summary list', () => {
        const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[8];
        const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
        const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

        expect(summaryListRow).to.exist;
        expect(rowKey.innerHTML).contains('Display To', 'Could not find row key');
        expect(rowValue.innerHTML).contains('14th February 2052 at 02:14 pm', 'Could not find row value');
    });

    it('should display the confirm re-submit subscription button', () => {
        const button = htmlRes.getElementById('confirm-resubmit-subscription');
        expect(button).to.exist;
        expect(button.innerHTML).contains('Confirm', 'Button text does not match');
    });

    it('should display the cancel button', () => {
        const link = htmlRes.getElementById('cancel-resubmit-subscription');
        expect(link).to.exist;
        expect(link.innerHTML).contains('Cancel', 'Link text does not match');
        expect(link.getAttribute('href')).equals('blob-view-locations', 'Link does not match');
    });
});
