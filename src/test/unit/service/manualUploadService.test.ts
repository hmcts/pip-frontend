import sinon from 'sinon';
import { expect } from 'chai';
import {ManualUploadService} from '../../../main/service/manualUploadService';
import {CourtService} from '../../../main/service/courtService';
import fs from 'fs';
import path from 'path';
import {multerFile} from '../mocks/multerFile';

const manualUploadService = new ManualUploadService();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);
sinon.stub(CourtService.prototype, 'fetchAllCourts').resolves(courtData);
const courtService = sinon.stub(CourtService.prototype, 'getCourtByName');
courtService.withArgs('validCourt').resolves(courtData[0]);

const validFile = multerFile('testFile.pdf', 1000);
const validFileCase = multerFile('testFile.HtMl', 1000);
const largeFile = multerFile('testFile.pdf', 3000000);
const invalidFileType = multerFile('testFile.xyz', 1000);
const nofileType = multerFile('testFile', 1000);

describe('Manual upload service', () => {
  describe('building form data', () => {
    it('should build form data court list', async () => {
      const data = await manualUploadService.buildFormData();
      expect(data['courtList']).to.equal(courtData);
    });

    it('should build form data list subtypes', async () => {
      const data = await manualUploadService.buildFormData();
      expect(data['listSubtypes'].length).to.equal(9);
      expect(data['listSubtypes'][0]).to.deep.equal({text:'SJP Public List', value: 'SJP_PUBLIC_LIST'});
    });

    it('should build form data judgements and outcomes subtypes', async () => {
      const data = await manualUploadService.buildFormData();
      expect(data['judgementsOutcomesSubtypes'].length).to.equal(1);
      expect(data['judgementsOutcomesSubtypes'][0]).to.deep.equal({text: 'SJP Media Register', value: 'SJP_MEDIA_REGISTER'});
    });
  });

  describe('File validation', () => {
    it('should return null when checking a valid file', () => {
      expect(manualUploadService.validateFileUpload(validFile)).to.be.null;
    });

    it('should return null when checking file type in different case sensitivity', () => {
      expect(manualUploadService.validateFileUpload(validFileCase)).to.be.null;
    });

    it('should return error message if file greater than 2MB', () => {
      expect(manualUploadService.validateFileUpload(largeFile)).to.equal('File too large, please upload file smaller than 2MB');
    });

    it('should return error message if invalid file type', () => {
      expect(manualUploadService.validateFileUpload(invalidFileType)).to.equal('Please upload a valid file format');
    });

    it('should return error message if missing file type', () => {
      expect(manualUploadService.validateFileUpload(nofileType)).to.equal('Please upload a valid file format');
    });

    it('should return error message if no file passed', () => {
      expect(manualUploadService.validateFileUpload(null)).to.equal('Please provide a file');
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
      };
    });

    it('should return null if all validated fields pass', async () => {
      expect(await manualUploadService.validateFormFields(formValues)).to.be.null;
    });

    it('should return invalid court error message', async () => {
      formValues['input-autocomplete'] = 'invalidCourt';
      const errors = await manualUploadService.validateFormFields(formValues);
      expect(errors['courtError']).to.equal('Please enter and select a valid court');
    });

    it('should return character minimum error message', async () => {
      formValues['input-autocomplete'] = 'ab';
      const errors = await manualUploadService.validateFormFields(formValues);
      expect(errors['courtError']).to.equal('Court name must be three characters or more');
    });

    it('should return error when invalid content date from is passed', async () => {
      formValues['content-date-from-day'] = '1';
      formValues['content-date-from-month'] = '1';
      formValues['content-date-from-year'] = '1';
      const errors = await manualUploadService.validateFormFields(formValues);
      expect(errors['contentDateError']).to.equal('Please enter a valid date');
    });

    it('should return error when invalid display date from is passed', async () => {
      formValues['display-date-from-day'] = '1';
      formValues['display-date-from-month'] = '1';
      formValues['display-date-from-year'] = '1';
      const errors = await manualUploadService.validateFormFields(formValues);
      expect(errors['displayDateError']['from']).to.equal('Please enter a valid date');
    });

    it('should return error when invalid display date to is passed', async () => {
      formValues['display-date-to-day'] = '1';
      formValues['display-date-to-month'] = '1';
      formValues['display-date-to-year'] = '1';
      const errors = await manualUploadService.validateFormFields(formValues);
      expect(errors['displayDateError']['to']).to.equal('Please enter a valid date');
    });

    it('should return error when invalid date range is passed', async () => {
      formValues['display-date-from-day'] = '02';
      formValues['display-date-from-month'] = '01';
      formValues['display-date-from-year'] = '2022';
      formValues['display-date-to-day'] = '01';
      formValues['display-date-to-month'] = '01';
      formValues['display-date-to-year'] = '2022';
      const errors = await manualUploadService.validateFormFields(formValues);
      expect(errors['displayDateError']['range']).to.equal('Please make sure \'to\' date is after \'from\' date');
    });
  });
  it('should return court id and name as object', async () => {
    expect(await manualUploadService.appendCourtId('validCourt')).to.deep.equal({courtName: 'validCourt', courtId: 1});
  });
});
