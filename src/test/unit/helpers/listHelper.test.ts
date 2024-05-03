import {
    formatMetaDataListType,
    hearingHasParty,
    isOneOfValidListTypes,
    isValidListType, missingListType
} from '../../../main/helpers/listHelper';
import fs from 'fs';
import path from 'path';

describe('List helper', () => {
    it('Hearing should have party', () => {
        const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/hearingparty/crownDailyList.json'), 'utf-8');
        expect(hearingHasParty(JSON.parse(rawData))).toBeTruthy();
    });

    it('Hearing should have no party', () => {
        const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/crownDailyList.json'), 'utf-8');
        expect(hearingHasParty(JSON.parse(rawData))).toBeFalsy();
    });

    it('should return formatted list type', () => {
        const metaData = { listType: 'TEST_LIST_TYPE' };

        expect(formatMetaDataListType(metaData)).toBe('test-list-type');
    });

    it('should not return any list type', () => {
        const metaData = null;

        expect(formatMetaDataListType(metaData)).toBe('');
    });

    it('should return true if the list type is valid', () => {
        const metaDataListType = 'test-list-type';
        const altMetaDataListType = 'alt-test-list-type';
        const listType = 'test-list-type';
        const altListType = 'alt-test-list-type';

        expect(isValidListType(metaDataListType, listType)).toBe(true);
        expect(isOneOfValidListTypes(altMetaDataListType, listType, altListType)).toBe(true);
    });

    it('should return false if the list type is not valid', () => {
        const metaDataListType = 'test-list-type';
        const listType = 'another-test-list-type';
        const altListType = 'alt-test-list-type';

        expect(isValidListType(metaDataListType, listType)).toBe(false);
        expect(isOneOfValidListTypes(metaDataListType, listType, altListType)).toBe(false);
    });

    it('should return true if the list type is blank', () => {
        const metaDataListType = '';

        expect(missingListType(metaDataListType)).toBe(true);
    });

    it('should return false if the list type is not blank', () => {
        const metaDataListType = 'TEST_LIST_TYPE';

        expect(missingListType(metaDataListType)).toBe(false);
    });

});
