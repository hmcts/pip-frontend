import sinon from 'sinon';
import { expect } from 'chai';
import {ManualUploadService} from '../../../main/service/manualUploadService';
import {CourtService} from '../../../main/service/courtService';
import { DataManagementRequests } from '../../../main/resources/requests/dataManagementRequests';
import fs from 'fs';
import path from 'path';
import {multerFile} from '../mocks/multerFile';

const manualUploadService = new ManualUploadService();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);
const headers = {
  userEmail: 'test@email.com',
  fileName: 'file.pdf',
  artefactType: 'type',
  classification: 'public',
  language: 'english',
  'display-from': '',
  'display-to': '',
  listType: 'type',
  court: {
    locationId: '1',
    courtName: 'Court',
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
const courtService = sinon.stub(CourtService.prototype, 'getCourtByName');
courtService.withArgs('validCourt').resolves(courtData[0]);

const validFile = multerFile('testFile.pdf', 1000);
const validFileCase = multerFile('testFile.HtMl', 1000);
const largeFile = multerFile('testFile.pdf', 3000000);
const invalidFileType = multerFile('testFile.xyz', 1000);
const nofileType = multerFile('testFile', 1000);
const validRemoveListInput = [{
  listType: 'SJP_PUBLIC_LIST',
  displayFrom: '2022-02-08T12:26:42.908',
  displayTo: '2024-02-08T12:26:42.908',
}];
const expectedRemoveList = [
  {
    listType: 'SJP_PUBLIC_LIST',
    displayFrom: '2022-02-08T12:26:42.908',
    displayTo: '2024-02-08T12:26:42.908',
    listTypeName: 'SJP Public List',
    dateRange: '8 Feb 2022 to 8 Feb 2024',
  },
];

sinon.stub(CourtService.prototype, 'fetchAllCourts').resolves(courtData);
sinon.stub(DataManagementRequests.prototype, 'uploadPublication').resolves(true);
sinon.stub(DataManagementRequests.prototype, 'uploadJSONPublication').resolves(true);
sinon.stub(fs, 'unlinkSync');

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

  it('should return file type', () => {
    const fileType = manualUploadService.getFileExtension('demo.pdf');
    expect(fileType).to.equal('pdf');
  });

  it('should generate headers object', () => {
    const builtHeaders = manualUploadService.generatePublicationUploadHeaders(headers);
    expect(builtHeaders).to.deep.equal(expectedHeaders);
  });

  it('should read a pdf file successfully', () => {
    const file = manualUploadService.readFile('validationFile.pdf');
    expect(file).to.be.instanceof(Buffer);
  });

  it('should read a json file successfully', () => {
    const file = manualUploadService.readFile('validationJson.json');
    expect(file).to.deep.equal({'name': 'this is valid json file'});
  });

  it('should return null if there is an error in reading a file', () => {
    const file = manualUploadService.readFile('foo.pdf');
    expect(file).to.be.null;
  });

  it('should remove a file', () => {
    expect(manualUploadService.removeFile('foo.pdf')).to.equal(void 0);
  });

  it('should upload a publication', async () => {
    const fileUpload = await manualUploadService.uploadPublication(headers, true);
    expect(fileUpload).to.be.true;
  });

  it('should upload a json publication', async () => {
    const data = headers;
    data.fileName = 'test.json';
    const fileUpload = await manualUploadService.uploadPublication(data, true);
    expect(fileUpload).to.be.true;
  });

  it('should return court id and name as object', async () => {
    expect(await manualUploadService.appendlocationId('validCourt')).to.deep.equal({courtName: 'validCourt', locationId: 1});
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
