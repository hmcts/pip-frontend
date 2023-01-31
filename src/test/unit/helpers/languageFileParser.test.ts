import { expect } from 'chai';
import { LanguageFileParser } from '../../../main/helpers/languageFileParser';

const languageFileParser = new LanguageFileParser();

const languageFileName = 'create-media-account';
const englishLanguage = 'en';
const welshLanguage = 'cy';

describe('Test language file parser helper', () => {
    it('check method can read the English language file', () => {
        const fileJson = languageFileParser.getLanguageFileJson(languageFileName, englishLanguage);
        expect(fileJson).not.empty;
    });

    it('check method can read the Welsh language file', () => {
        const fileJson = languageFileParser.getLanguageFileJson(languageFileName, welshLanguage);
        expect(fileJson).not.empty;
    });

    it('check method can read node from the English language file', () => {
        const fileJson = languageFileParser.getLanguageFileJson(languageFileName, englishLanguage);
        expect(languageFileParser.getText(fileJson, null, 'nameLabel')).to.equal('Full name');
    });

    it('check method can read error node from the English language file', () => {
        const fileJson = languageFileParser.getLanguageFileJson(languageFileName, englishLanguage);
        expect(languageFileParser.getText(fileJson, 'fullNameErrors', 'blank')).to.equal(
            'There is a problem - Full name field must be populated'
        );
    });

    it('check method can read node from the Welsh language file', () => {
        const fileJson = languageFileParser.getLanguageFileJson(languageFileName, welshLanguage);
        expect(languageFileParser.getText(fileJson, null, 'nameLabel')).to.equal('Enw llawn');
    });

    it('check method can read error node from Welsh English language file', () => {
        const fileJson = languageFileParser.getLanguageFileJson(languageFileName, welshLanguage);
        expect(languageFileParser.getText(fileJson, 'fullNameErrors', 'blank')).to.equal(
            'Mae yna broblem - Rhaid rhoi enw llawn'
        );
    });
});
