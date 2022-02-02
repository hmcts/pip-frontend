import sinon from 'sinon';
import { expect } from 'chai';
import {ManualUploadService} from '../../../main/service/manualUploadService';
import {CourtService} from '../../../main/service/courtService';
import { DataManagementRequests } from '../../../main/resources/requests/dataManagementRequests';
import fs from 'fs';
import path from 'path';

const manualUploadService = new ManualUploadService();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);
const headers = {
  userId: '1',
  fileName: 'file.pdf',
  artefactType: 'type',
  classification: 'public',
  language: 'english',
  'display-from': '',
  'display-to': '',
  listType: 'type',
  court: {
    courtId: '1',
    courtName: 'Court',
  },
  'content-date-from': '',
};
const expectedHeaders = {
  'x-provenance': headers.userId,
  'x-source-artefact-id': headers.fileName,
  'x-type': headers.artefactType,
  'x-sensitivity': headers.classification,
  'x-language': headers.language,
  'x-display-from': headers['display-from'],
  'x-display-to': headers['display-to'],
  'x-list-type': headers.listType,
  'x-court-id': headers.court.courtId,
  'x-content-date': headers['content-date-from'],
};
sinon.stub(CourtService.prototype, 'fetchAllCourts').resolves(courtData);
sinon.stub(DataManagementRequests.prototype, 'uploadPublication').resolves(true);
sinon.stub(DataManagementRequests.prototype, 'uploadJSONPublication').resolves(true);
sinon.stub(fs, 'unlinkSync');

describe('Manual upload service', () => {
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

  it('should build form data classification', async () => {
    const data = await manualUploadService.buildFormData();
    expect(data['classification'].length).to.equal(5);
    expect(data['classification'][0]).to.deep.equal({text: 'Public', value: 'PUBLIC'});
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
});
