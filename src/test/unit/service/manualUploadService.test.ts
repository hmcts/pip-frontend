import sinon from 'sinon';
import { expect } from 'chai';
import {ManualUploadService} from '../../../main/service/manualUploadService';
import {CourtService} from '../../../main/service/courtService';
import fs from 'fs';
import path from 'path';

const manualUploadService = new ManualUploadService();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);
sinon.stub(CourtService.prototype, 'fetchAllCourts').resolves(courtData);

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

});
