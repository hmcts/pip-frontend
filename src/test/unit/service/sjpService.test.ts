import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { SjpService } from '../../../main/service/sjpService';
import { SjpRequests } from '../../../main/resources/requests/sjpRequests';

const sjpService = new SjpService();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/trimmedSJPCases.json'), 'utf-8');
const sjpCases = JSON.parse(rawData).results;
const validSJPCase = {
  Name: 'A Morley',
  Town: 'Aberdeen',
  County: '',
  Postcode: 'AB',
  Offence: 'Keep a vehicle without a valid vehicle licence',
  Prosecutor: 'Driver and Vehicle Licensing Agency',
};

sinon.stub(SjpRequests.prototype, 'getSJPCases').returns(sjpCases);

describe('Single Justice Procedure Service', () => {
  it('should return sjp cases list', async () => {
    const data = await sjpService.getSJPCases();
    expect(data).toStrictEqual(sjpCases);
  });

  it('should contain valid sjp case', async () => {
    const data = await sjpService.getSJPCases();
    expect(data[0]).toStrictEqual(validSJPCase);
  });

  it('should contain an object with all attributes', async () => {
    const data = await sjpService.getSJPCases();
    const randomCase = data[Math.floor(Math.random() * data.length)];
    expect(Object.keys(randomCase)).toStrictEqual(Object.keys(validSJPCase));
  });
});
