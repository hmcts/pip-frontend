import request from 'supertest';
import { DateTime } from 'luxon';
import { app } from '../../../main/app';
import { expect } from 'chai';

let htmlRes: Document;
const PAGE_URL = '/manual-upload-summary';
const summaryKeys = [
    'Court name',
    'File',
    'List type',
    'Hearing start date',
    'Sensitivity',
    'Language',
    'Display file dates',
];
const manualUploadLinks = [
    '#search-input',
    '#manual-file-upload',
    '#listType',
    '#content-date-from-day',
    '#classification',
    '#language',
    '#display-date-from-day',
];

const mockData = {
    artefactType: 'List',
    classification: 'PUBLIC',
    'content-date-from': '01/01/2022',
    court: {
        courtName: 'Aberdeen Tribunal Hearing Centre',
    },
    'display-from': '02/03/2022',
    'display-to': '04/05/2022',
    fileName: 'Demo.pdf',
    language: 'English',
    listType: 'SJP_PUBLIC_LIST',
    languageName: 'English',
    classificationName: 'Classified',
};

describe('File Upload Summary Page', () => {
    beforeAll(async () => {
        app.request['user'] = { roles: 'SYSTEM_ADMIN' };
        app.request['cookies'] = { formCookie: JSON.stringify(mockData) };

        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display correct title', async () => {
        const title = htmlRes.getElementsByClassName('govuk-heading-l')[0];
        expect(title.innerHTML).to.equal('Check upload details', 'Unable to find header');
    });

    it('should display confirm button', async () => {
        const button = htmlRes.getElementsByClassName('govuk-button')[0];
        expect(button.innerHTML).to.contain('Confirm', 'Unable to find confirm button');
    });

    it('should display correct summary keys and actions', async () => {
        const keys = htmlRes.getElementsByClassName('govuk-summary-list__key');
        const actions = htmlRes.getElementsByClassName('govuk-summary-list__actions');
        for (let i = 0; i < summaryKeys.length; i++) {
            expect(keys[i].innerHTML).to.contain(summaryKeys[i], `Unable to find ${summaryKeys[i]} summary key`);
            expect(actions[i].getElementsByClassName('govuk-link')[0].innerHTML).to.contain('Change');
            expect(actions[i].getElementsByClassName('govuk-link')[0].getAttribute('href')).to.equal(
                'manual-upload' + manualUploadLinks[i]
            );
        }
    });

    it('should display correct summary values', async () => {
        const formatContentDate = DateTime.fromFormat(mockData['content-date-from'], 'dd/MM/yyyy HH:mm:ss').toFormat(
            'd MMMM YYYY'
        );
        const formatDisplayFromDate = DateTime.fromFormat(mockData['display-from'], 'dd/MM/yyyy HH:mm:ss').toFormat(
            'd MMMM YYYY'
        );
        const formatDisplayToDate = DateTime.fromFormat(mockData['display-to'], 'dd/MM/yyyy HH:mm:ss').toFormat(
            'd MMMM YYYY'
        );
        const values = htmlRes.getElementsByClassName('govuk-summary-list__value');
        expect(values[0].innerHTML).to.contain(mockData.court.courtName, 'Court value not found');
        expect(values[1].innerHTML).to.contain(mockData.fileName, 'File value not found');
        expect(values[2].innerHTML).to.contain('SJP Public List', 'List type value not found');
        expect(values[3].innerHTML).to.contain(formatContentDate, 'Hearing start date value not found');
        expect(values[4].innerHTML).to.contain(mockData.classificationName, 'Classification values not found');
        expect(values[5].innerHTML).to.contain(mockData.languageName, 'Language value not found');
        expect(values[6].innerHTML).to.contain(
            `${formatDisplayFromDate} to ${formatDisplayToDate}`,
            'Display dates values not found'
        );
    });

    it('should not contain the warning text as no mismatch', async () => {
        const warningText = htmlRes.getElementsByClassName('govuk-warning-text');
        expect(warningText.length).to.equal(0);
    });
});

describe('File Upload Summary when classification mismatch', () => {
    const clonedMockData = JSON.parse(JSON.stringify(mockData));
    clonedMockData['listType'] = 'SJP_PRESS_LIST';

    beforeAll(async () => {
        app.request['user'] = { roles: 'SYSTEM_ADMIN' };
        app.request['cookies'] = { formCookie: JSON.stringify(clonedMockData) };

        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have the warning title', async () => {
        const warningHeading = htmlRes.getElementsByClassName('govuk-heading-m');
        expect(warningHeading[0].innerHTML).to.contain('Warning');
    });

    it('should have the warning message', async () => {
        const warningText = htmlRes.getElementsByClassName('govuk-warning-text');
        expect(warningText[0].innerHTML).to.contain(
            'Please ensure you have checked the sensitivity of the list you are about to publish, ' +
                'the data contained within it and the consequences if this is published incorrectly.'
        );
    });
});
