import {expect} from 'chai';
import fs from 'fs';
import path from 'path';
import {PrimaryHealthListService} from '../../../../main/service/listManipulation/primaryHealthListService';

const primaryHealthListService = new PrimaryHealthListService();

const testData = fs.readFileSync(path.resolve(__dirname, '../../mocks/primaryHealthList.json'), 'utf-8');

describe('Primary Health List service', () => {

  it('Should have added Hearing Date to the formatted response', () => {
    const data = primaryHealthListService.manipulateData(testData);
    expect(data[0].hearingDate).to.contain('04 October');
  });

  it('Should have added case Name to the formatted response', () => {
    const data = primaryHealthListService.manipulateData(testData);
    expect(data[0].caseName).to.contain('A Vs B');
  });

  it('Should have added duration as days to the formatted response', () => {
    const data = primaryHealthListService.manipulateData(testData);
    expect(data[0].durationAsDays).to.equal(1);
  });

  it('Should have added duration as hours to the formatted response', () => {
    const data = primaryHealthListService.manipulateData(testData);
    expect(data[0].durationAsHours).to.equal(24);
  });

  it('Should have added duration as minutes to the formatted response', () => {
    const data = primaryHealthListService.manipulateData(testData);
    expect(data[0].durationAsMinutes).to.equal(30);
  });

  it('Should have added case sequence Indicator to the formatted response', () => {
    const data = primaryHealthListService.manipulateData(testData);
    expect(data[0].caseSequenceIndicator).to.equal('[2 of 3]');
  });

  it('Should have added haring type to the formatted response', () => {
    const data = primaryHealthListService.manipulateData(testData);
    expect(data[0].hearingType).to.equal('Remote - Teams');
  });

  it('Should have added venue to the formatted response', () => {
    const data = primaryHealthListService.manipulateData(testData);
    expect(data[0].venue).to.equal('PRESTON\n' +
      'Address Line 1\n' +
      'AA1 AA1');
  });
});
