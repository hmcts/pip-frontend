import {
    formatMetaDataListType,
    isOneOfValidListTypes,
    isValidList,
    isValidListType,
    missingListType,
} from '../../main/helpers/listHelper';
import { HttpStatusCode } from 'axios';

describe('List Helper', () => {
    it('should return true if the list is valid', () => {
        const searchResults = 'Test data';
        const metaData = 'Test data';

        expect(isValidList(searchResults, metaData)).toBe(true);
    });

    it('should return false if the list is not valid', () => {
        const searchResults = null;
        const metaData = null;

        expect(isValidList(searchResults, metaData)).toBe(true);
    });

    it('should return false if the status codes are 404', () => {
        const searchResults = HttpStatusCode.NotFound;
        const metaData = HttpStatusCode.NotFound;

        expect(isValidList(searchResults, metaData)).toBe(true);
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
        const metaDataListType = 'TEST_LIST_TYPE';
        const altMetaDataListType = 'ALT_TEST_LIST_TYPE';
        const listType = 'test-list-type';
        const altListType = 'alt-test-list-type';

        expect(isValidListType(metaDataListType, listType)).toBe(true);
        expect(isOneOfValidListTypes(altMetaDataListType, listType, altListType)).toBe(true);
    });

    it('should return false if the list type is not valid', () => {
        const metaDataListType = 'TEST_LIST_TYPE';
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
        const metaDataListType = '';

        expect(missingListType(metaDataListType)).toBe(true);
    });

    it('should return false if the list type is not valid', () => {
        const metaDataListType = 'TEST_LIST_TYPE';

        expect(missingListType(metaDataListType)).toBe(false);
    });
});
