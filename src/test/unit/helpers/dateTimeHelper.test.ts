import {expect} from 'chai';
import {DateTimeHelper} from '../../../main/helpers/dateTimeHelper';

const dateTimeHelper = new DateTimeHelper();

const englishLanguage = 'en';
const welshLanguage = 'cy';
const languageFile = 'case-standards-list';

describe('DateTime helper class', () => {
  describe('DateTimeHelper', () => {
    it('should formatted duration correctly for english', () => {
      const result = dateTimeHelper.formatDuration(0,3, 10, englishLanguage, languageFile);
      expect(result).to.equal('3 hours 10 mins');
    });

    it('should formatted duration correctly with no minute for english', () => {
      const result = dateTimeHelper.formatDuration(0,3, 0, englishLanguage, languageFile);
      expect(result).to.equal('3 hours');
    });

    it('should formatted duration correctly with single hour and no minute for english', () => {
      const result = dateTimeHelper.formatDuration(0,1, 0, englishLanguage, languageFile);
      expect(result).to.equal('1 hour');
    });

    it('should formatted duration correctly with no hour and more than one minute for english', () => {
      const result = dateTimeHelper.formatDuration(0,0, 30, englishLanguage, languageFile);
      expect(result).to.equal('30 mins');
    });

    it('should formatted duration correctly with no hour and single minute for english', () => {
      const result = dateTimeHelper.formatDuration(0,0, 1, englishLanguage, languageFile);
      expect(result).to.equal('1 min');
    });

    it('should return empty when there is no hour and minute for english', () => {
      const result = dateTimeHelper.formatDuration(0,0, 0, englishLanguage, languageFile);
      expect(result).to.equal('');
    });

    it('should formatted duration correctly for welsh', () => {
      const result = dateTimeHelper.formatDuration(0,3, 10, welshLanguage, languageFile);
      expect(result).to.equal('3 awr 10 munud');
    });

    it('should formatted duration correctly with no minute for welsh', () => {
      const result = dateTimeHelper.formatDuration(0,3, 0, welshLanguage, languageFile);
      expect(result).to.equal('3 awr');
    });

    it('should formatted duration correctly with single hour and no minute for welsh', () => {
      const result = dateTimeHelper.formatDuration(0,1, 0, welshLanguage, languageFile);
      expect(result).to.equal('1 awr');
    });

    it('should formatted duration correctly with no hour and more than one minute for welsh', () => {
      const result = dateTimeHelper.formatDuration(0,0, 30, welshLanguage, languageFile);
      expect(result).to.equal('30 munud');
    });

    it('should formatted duration correctly with no hour and single minute for welsh', () => {
      const result = dateTimeHelper.formatDuration(0,0, 1, welshLanguage, languageFile);
      expect(result).to.equal('1 munud');
    });

    it('should return empty when there is no hour and minute for welsh', () => {
      const result = dateTimeHelper.formatDuration(0,0, 0, welshLanguage, languageFile);
      expect(result).to.equal('');
    });

    it('should formatted duration correctly with 1 day for english', () => {
      const result = dateTimeHelper.formatDuration(1,0, 0, englishLanguage, languageFile);
      expect(result).to.equal('1 day');
    });

    it('should formatted duration correctly with more than 1 day for english', () => {
      const result = dateTimeHelper.formatDuration(3,0, 0, englishLanguage, languageFile);
      expect(result).to.equal('3 days');
    });

    it('should formatted duration correctly with 1 day for welsh', () => {
      const result = dateTimeHelper.formatDuration(1,0, 0, welshLanguage, languageFile);
      expect(result).to.equal('1 Dydd');
    });

    it('should formatted duration correctly with more than 1 day for welsh', () => {
      const result = dateTimeHelper.formatDuration(3,0, 0, welshLanguage, languageFile);
      expect(result).to.equal('3 Dydd');
    });
  });
});
