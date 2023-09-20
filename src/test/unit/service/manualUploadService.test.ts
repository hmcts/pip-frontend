import sinon from 'sinon';
import { expect } from 'chai';
import { ManualUploadService } from '../../../main/service/manualUploadService';
import { LocationService } from '../../../main/service/locationService';
import { DataManagementRequests } from '../../../main/resources/requests/dataManagementRequests';
import { PublicationService } from '../../../main/service/publicationService';
import fs from 'fs';
import path from 'path';

const manualUploadService = new ManualUploadService();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);
const headers = {
    userEmail: 'test@email.com',
    fileName: 'file.pdf',
    artefactType: 'type',
    classification: 'classified',
    language: 'english',
    'display-from': '01/07/2022 00:00:01',
    'display-to': '01/07/2022 23:59:59',
    listType: 'type',
    court: {
        locationId: '1',
        locationName: 'Court',
    },
    'content-date-from': '',
};
const expectedHeaders = {
    'x-provenance': 'MANUAL_UPLOAD',
    'x-source-artefact-id': headers.fileName,
    'x-type': headers.artefactType,
    'x-sensitivity': headers.classification,
    'x-language': headers.language,
    'x-display-from': headers['display-from'],
    'x-display-to': headers['display-to'],
    'x-list-type': headers.listType,
    'x-court-id': headers.court.locationId,
    'x-content-date': headers['content-date-from'],
    'x-issuer-email': 'test@email.com',
};
const courtService = sinon.stub(LocationService.prototype, 'getLocationByName');
courtService.withArgs('validCourt').resolves(courtData[0]);

const validRemoveListInput = [
    {
        listType: 'SJP_PUBLIC_LIST',
        displayFrom: '2022-02-08T12:26:42.908',
        displayTo: '2024-02-08T12:26:42.908',
        contentDate: '2022-02-08T00:00:00',
    },
];
const expectedRemoveList = [
    {
        listType: 'SJP_PUBLIC_LIST',
        contentDate: '2022-02-08T00:00:00',
        contDate: '8 Feb 2022',
        displayFrom: '2022-02-08T12:26:42.908',
        displayTo: '2024-02-08T12:26:42.908',
        listTypeName: 'SJP Public List',
        dateRange: '8 Feb 2022 to 8 Feb 2024',
    },
];

const englishLanguage = 'en';
const welshLanguage = 'cy';
const languageFile = 'manual-upload';

const jsonUploadArtefactId = '123';
const fileUploadArtefactId = '456';

sinon.stub(LocationService.prototype, 'fetchAllLocations').resolves(courtData);
sinon.stub(DataManagementRequests.prototype, 'uploadPublication').resolves(fileUploadArtefactId);
sinon.stub(DataManagementRequests.prototype, 'uploadJSONPublication').resolves(jsonUploadArtefactId);
sinon.stub(DataManagementRequests.prototype, 'uploadLocationFile').resolves(true);

describe('Manual upload service', () => {
    describe('building form data', () => {
        it('should build form data court list', async () => {
            const data = await manualUploadService.buildFormData(englishLanguage);
            expect(data['courtList']).to.equal(courtData);
        });

        it('should build form data for Welsh court list', async () => {
            const data = await manualUploadService.buildFormData(welshLanguage);
            expect(data['courtList']).to.equal(courtData);
        });

        it('should build form data list subtypes', async () => {
            const data = await manualUploadService.buildFormData(englishLanguage);
            expect(data['listSubtypes'].length).to.equal(21);
            expect(data['listSubtypes'][0]).to.deep.equal({
                text: '<Please choose a list type>',
                value: 'EMPTY',
            });
        });

        it('should build form data judgements and outcomes subtypes', async () => {
            const data = await manualUploadService.buildFormData(englishLanguage);
            expect(data['judgementsOutcomesSubtypes'].length).to.equal(1);
            expect(data['judgementsOutcomesSubtypes'][0]).to.deep.equal({
                text: 'SJP Media Register',
                value: 'SJP_MEDIA_REGISTER',
            });
        });
    });

    describe('Check for sensitivity mismatch', () => {
        const stub = sinon.stub(PublicationService.prototype, 'getDefaultSensitivity');

        it('should return true if sensitivity does not match default sensitivity', () => {
            stub.returns('CLASSIFIED');
            expect(manualUploadService.isSensitivityMismatch('SJP_PRESS_LIST', 'PUBLIC')).to.be.true;
        });

        it('should return false if sensitivity matches the default sensitivity', () => {
            stub.returns('CLASSIFIED');
            expect(manualUploadService.isSensitivityMismatch('SJP_PRESS_LIST', 'CLASSIFIED')).to.be.false;
        });

        it('should return false if blank mismatch provided', () => {
            stub.returns('');
            expect(manualUploadService.isSensitivityMismatch('SJP_PRESS_LIST', 'CLASSIFIED')).to.be.false;
        });

        it('should return false if null mismatch provided', () => {
            stub.returns(null);
            expect(manualUploadService.isSensitivityMismatch('SJP_PRESS_LIST', 'CLASSIFIED')).to.be.false;
        });
    });

    describe('Get sensitivity mappings', () => {
        it('should retrieve sensitivity mappings', () => {
            const sensitivityMappings = manualUploadService.getSensitivityMappings();

            expect(sensitivityMappings['SJP_PUBLIC_LIST']).to.equal('');
            expect(sensitivityMappings['SJP_PRESS_LIST']).to.equal('CLASSIFIED');
        });
    });

    describe('Form validation', () => {
        courtService.withArgs('invalidCourt').resolves(null);

        let formValues = {};
        beforeEach(() => {
            formValues = {
                'input-autocomplete': 'validCourt',
                'content-date-from-day': '01',
                'content-date-from-month': '01',
                'content-date-from-year': '2022',
                'content-date-to-day': '01',
                'content-date-to-month': '01',
                'content-date-to-year': '2022',
                'display-date-from-day': '01',
                'display-date-from-month': '01',
                'display-date-from-year': '2022',
                'display-date-to-day': '01',
                'display-date-to-month': '01',
                'display-date-to-year': '2022',
                classification: 'PUBLIC',
            };
        });

        it('should return null if all validated fields pass', async () => {
            expect(await manualUploadService.validateFormFields(formValues, englishLanguage, languageFile)).to.be.null;
        });

        it('should return null if all validated fields pass', async () => {
            expect(await manualUploadService.validateFormFields(formValues, welshLanguage, languageFile)).to.be.null;
        });

        it('should return invalid court error message', async () => {
            formValues['input-autocomplete'] = 'invalidCourt';
            const errors = await manualUploadService.validateFormFields(formValues, englishLanguage, languageFile);
            expect(errors['courtError']).to.equal('Please enter and select a valid court');
        });

        it('should return missing list type error message', async () => {
            formValues['listType'] = 'EMPTY';
            const errors = await manualUploadService.validateFormFields(formValues, welshLanguage, languageFile);
            expect(errors['listTypeError']).to.equal('true');
        });

        it('should return invalid court error message', async () => {
            formValues['input-autocomplete'] = 'invalidCourt';
            const errors = await manualUploadService.validateFormFields(formValues, welshLanguage, languageFile);
            expect(errors['courtError']).to.equal('Please enter and select a valid court');
        });

        it('should return character minimum error message', async () => {
            formValues['input-autocomplete'] = 'ab';
            const errors = await manualUploadService.validateFormFields(formValues, englishLanguage, languageFile);
            expect(errors['courtError']).to.equal('Court name must be three characters or more');
        });

        it('should return character minimum error message', async () => {
            formValues['input-autocomplete'] = 'ab';
            const errors = await manualUploadService.validateFormFields(formValues, welshLanguage, languageFile);
            expect(errors['courtError']).to.equal('Court name must be three characters or more');
        });

        it('should return error when invalid content date from is passed', async () => {
            formValues['content-date-from-day'] = '1';
            formValues['content-date-from-month'] = '1';
            formValues['content-date-from-year'] = '1';
            const errors = await manualUploadService.validateFormFields(formValues, englishLanguage, languageFile);
            expect(errors['contentDateError']).to.equal('Please enter a valid date');
        });

        it('should return error when invalid content date from is passed for Welsh language', async () => {
            formValues['content-date-from-day'] = '1';
            formValues['content-date-from-month'] = '1';
            formValues['content-date-from-year'] = '1';
            const errors = await manualUploadService.validateFormFields(formValues, welshLanguage, languageFile);
            expect(errors['contentDateError']).to.equal('Please enter a valid date');
        });

        it('should return error when invalid display date from is passed', async () => {
            formValues['display-date-from-day'] = '1';
            formValues['display-date-from-month'] = '1';
            formValues['display-date-from-year'] = '1';
            const errors = await manualUploadService.validateFormFields(formValues, englishLanguage, languageFile);
            expect(errors['displayDateError']['from']).to.equal('Please enter a valid date');
        });

        it('should return error when invalid display date from is passed for Welsh language', async () => {
            formValues['display-date-from-day'] = '1';
            formValues['display-date-from-month'] = '1';
            formValues['display-date-from-year'] = '1';
            const errors = await manualUploadService.validateFormFields(formValues, welshLanguage, languageFile);
            expect(errors['displayDateError']['from']).to.equal('Please enter a valid date');
        });

        it('should return error when invalid display date to is passed', async () => {
            formValues['display-date-to-day'] = '1';
            formValues['display-date-to-month'] = '1';
            formValues['display-date-to-year'] = '1';
            const errors = await manualUploadService.validateFormFields(formValues, englishLanguage, languageFile);
            expect(errors['displayDateError']['to']).to.equal('Please enter a valid date');
        });

        it('should return error when invalid display date to is passed for Welsh language', async () => {
            formValues['display-date-to-day'] = '1';
            formValues['display-date-to-month'] = '1';
            formValues['display-date-to-year'] = '1';
            const errors = await manualUploadService.validateFormFields(formValues, welshLanguage, languageFile);
            expect(errors['displayDateError']['to']).to.equal('Please enter a valid date');
        });

        it('should return error when invalid date range is passed', async () => {
            formValues['display-date-from-day'] = '02';
            formValues['display-date-from-month'] = '01';
            formValues['display-date-from-year'] = '2022';
            formValues['display-date-to-day'] = '01';
            formValues['display-date-to-month'] = '01';
            formValues['display-date-to-year'] = '2022';
            const errors = await manualUploadService.validateFormFields(formValues, englishLanguage, languageFile);
            expect(errors['displayDateError']['range']).to.equal("Please make sure 'to' date is after 'from' date");
        });

        it('should return error when invalid date range is passed for Welsh language', async () => {
            formValues['display-date-from-day'] = '02';
            formValues['display-date-from-month'] = '01';
            formValues['display-date-from-year'] = '2022';
            formValues['display-date-to-day'] = '01';
            formValues['display-date-to-month'] = '01';
            formValues['display-date-to-year'] = '2022';
            const errors = await manualUploadService.validateFormFields(formValues, welshLanguage, languageFile);
            expect(errors['displayDateError']['range']).to.equal("Please make sure 'to' date is after 'from' date");
        });

        it('should formatted date-from date correctly', async () => {
            formValues['display-date-from-day'] = '1';
            formValues['display-date-from-month'] = '7';
            formValues['display-date-from-year'] = '2022';
            const data = await manualUploadService.buildDate(formValues, 'display-date-from');
            expect(data).to.equal('1/7/2022 00:00:01');
        });

        it('should formatted date-to date correctly', async () => {
            formValues['display-date-to-day'] = '1';
            formValues['display-date-to-month'] = '7';
            formValues['display-date-to-year'] = '2022';
            const data = await manualUploadService.buildDate(formValues, 'display-date-to');
            expect(data).to.equal('1/7/2022 23:59:59');
        });

        it('should formatted content date correctly', async () => {
            formValues['content-date-from-day'] = '1';
            formValues['content-date-from-month'] = '7';
            formValues['content-date-from-year'] = '2022';
            const data = await manualUploadService.buildDate(formValues, 'content-date-from');
            expect(data).to.equal('1/7/2022 00:00:00');
        });

        it('should return classification error when null', async () => {
            formValues['classification'] = null;
            const errors = await manualUploadService.validateFormFields(formValues, welshLanguage, languageFile);
            expect(errors['classificationError']).to.equal('true');
        });

        it('should return classification error when blank', async () => {
            formValues['classification'] = '';
            const errors = await manualUploadService.validateFormFields(formValues, welshLanguage, languageFile);
            expect(errors['classificationError']).to.equal('true');
        });

        it('should return classification error when not provided', async () => {
            delete formValues['classification'];
            const errors = await manualUploadService.validateFormFields(formValues, welshLanguage, languageFile);
            expect(errors['classificationError']).to.equal('true');
        });
    });

    it('should generate headers object', () => {
        const builtHeaders = manualUploadService.generatePublicationUploadHeaders(headers);
        expect(builtHeaders).to.deep.equal(expectedHeaders);
    });

    it('should upload a publication', async () => {
        const fileUpload = await manualUploadService.uploadPublication(headers, true);
        expect(fileUpload).to.equal(fileUploadArtefactId);
    });

    it('should upload a reference data file', async () => {
        const fileUpload = await manualUploadService.uploadLocationDataPublication(headers);
        expect(fileUpload).to.be.true;
    });

    it('should upload a json publication', async () => {
        const data = headers;
        data.fileName = 'test.json';
        const fileUpload = await manualUploadService.uploadPublication(data, true);
        expect(fileUpload).to.equal(jsonUploadArtefactId);
    });

    it('should formatted date-from and date-to correctly', async () => {
        const data = await manualUploadService.formatPublicationDates(headers, true);
        expect(data['display-from']).to.contains('2022-07-01T00:00:01');
        expect(data['display-to']).to.contains('2022-07-01T23:59:59');
    });

    it('should return court id and name as object', async () => {
        expect(await manualUploadService.appendlocationId('validCourt', englishLanguage)).to.deep.equal({
            courtName: 'validCourt',
            locationId: 1,
        });
    });

    describe('formatting list removal', () => {
        it('should return empty list if input is empty list', () => {
            const list = manualUploadService.formatListRemovalValues([]);
            expect(list).to.deep.equal([]);
        });

        it('should return formatted list for a valid input list', () => {
            const list = manualUploadService.formatListRemovalValues(validRemoveListInput);
            expect(list).to.deep.equal(expectedRemoveList);
        });
    });
});
