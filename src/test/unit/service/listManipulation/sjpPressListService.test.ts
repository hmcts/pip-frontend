import { expect } from 'chai';
import { SjpPressListService} from '../../../../main/service/listManipulation/SjpPressListService';
import fs from 'fs';
import path from 'path';

const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../../mocks/SJPMockPage.json'), 'utf-8');
const sjpPressListService = new SjpPressListService();

describe('formatSJPPressList', () => {
  it('should return SJP Press List', async () => {
    const data = await sjpPressListService.formatSJPPressList(rawSJPData);
    expect(data['courtLists'].length).to.equal(1);
  });

  it('should formatted date of birth in correct format', async () => {
    const data = await sjpPressListService.formatSJPPressList(rawSJPData);
    expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['party'][0]['individualDetails']['formattedDateOfBirth']).to.equal('25 July 1985');
  });

  it('should formatted Reporting Restriction in correct format', async () => {
    const data = await sjpPressListService.formatSJPPressList(rawSJPData);
    expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['offence'][0]['formattedReportingRestriction']).to.equal('True');
  });

  it('should count total no of hearings', async () => {
    const data = await sjpPressListService.formatSJPPressList(rawSJPData);
    expect(data['hearingCount']).to.equal(2);
  });
});
