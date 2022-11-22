import {expect} from 'chai';
import {formatDate, formatDuration} from '../../../main/helpers/dateTimeHelper';

const englishLanguage = 'en';
const welshLanguage = 'cy';
const languageFile = 'care-standards-list';
const testBstDate = '2022-10-27T09:40:17.496Z';
const testGmtDate = '2022-11-27T09:40:17.496Z';

describe('formatDuration', () => {
  it('should formatted duration correctly for english', () => {
    const result = formatDuration(0,3, 10, englishLanguage, languageFile);
    expect(result).to.equal('3 hours 10 mins');
  });

  it('should formatted duration correctly with no minute for english', () => {
    const result = formatDuration(0,3, 0, englishLanguage, languageFile);
    expect(result).to.equal('3 hours');
  });

  it('should formatted duration correctly with single hour and no minute for english', () => {
    const result = formatDuration(0,1, 0, englishLanguage, languageFile);
    expect(result).to.equal('1 hour');
  });

  it('should formatted duration correctly with no hour and more than one minute for english', () => {
    const result = formatDuration(0,0, 30, englishLanguage, languageFile);
    expect(result).to.equal('30 mins');
  });

  it('should formatted duration correctly with no hour and single minute for english', () => {
    const result = formatDuration(0,0, 1, englishLanguage, languageFile);
    expect(result).to.equal('1 min');
  });

  it('should return empty when there is no hour and minute for english', () => {
    const result = formatDuration(0,0, 0, englishLanguage, languageFile);
    expect(result).to.equal('');
  });

  it('should formatted duration correctly for welsh', () => {
    const result = formatDuration(0,3, 10, welshLanguage, languageFile);
    expect(result).to.equal('3 awr 10 munud');
  });

  it('should formatted duration correctly with no minute for welsh', () => {
    const result = formatDuration(0,3, 0, welshLanguage, languageFile);
    expect(result).to.equal('3 awr');
  });

  it('should formatted duration correctly with single hour and no minute for welsh', () => {
    const result = formatDuration(0,1, 0, welshLanguage, languageFile);
    expect(result).to.equal('1 awr');
  });

  it('should formatted duration correctly with no hour and more than one minute for welsh', () => {
    const result = formatDuration(0,0, 30, welshLanguage, languageFile);
    expect(result).to.equal('30 munud');
  });

  it('should formatted duration correctly with no hour and single minute for welsh', () => {
    const result = formatDuration(0,0, 1, welshLanguage, languageFile);
    expect(result).to.equal('1 munud');
  });

  it('should return empty when there is no hour and minute for welsh', () => {
    const result = formatDuration(0,0, 0, welshLanguage, languageFile);
    expect(result).to.equal('');
  });

  it('should formatted duration correctly with 1 day for english', () => {
    const result = formatDuration(1,0, 0, englishLanguage, languageFile);
    expect(result).to.equal('1 day');
  });

  it('should formatted duration correctly with more than 1 day for english', () => {
    const result = formatDuration(3,0, 0, englishLanguage, languageFile);
    expect(result).to.equal('3 days');
  });

  it('should formatted duration correctly with 1 day for welsh', () => {
    const result = formatDuration(1,0, 0, welshLanguage, languageFile);
    expect(result).to.equal('1 Dydd');
  });

  it('should formatted duration correctly with more than 1 day for welsh', () => {
    const result = formatDuration(3,0, 0, welshLanguage, languageFile);
    expect(result).to.equal('3 Dydd');
  });
});

describe('formatDate', () => {
  it('should format both date and time in BST', () => {
    const result = formatDate(testBstDate, 'dddd DD MMMM YYYY hh:mm:ss');
    expect(result).to.equal('Thursday 27 October 2022 10:40:17');
  });

  it('should format both date and time in GMT', () => {
    const result = formatDate(testGmtDate, 'dddd DD MMMM YYYY hh:mm:ss');
    expect(result).to.equal('Sunday 27 November 2022 09:40:17');
  });

  it('should format date only', () => {
    const result = formatDate(testGmtDate, 'DD/MM/YYYY');
    expect(result).to.equal('27/11/2022');
  });

  it('should format time only', () => {
    const result = formatDate(testGmtDate, 'h:mma');
    expect(result).to.equal('9:40am');
  });
});

