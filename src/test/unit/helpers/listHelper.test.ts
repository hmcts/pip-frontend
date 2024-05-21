import sinon from 'sinon';
import {
    formatMetaDataListType,
    hearingHasParty,
    isOneOfValidListTypes,
    isValidList,
    isValidListType,
    missingListType,
    addListDetailsToArray
} from '../../../main/helpers/listHelper';
import { HttpStatusCode } from 'axios';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/PublicationService';

const mockArtefact = {
    listType: 'CIVIL_DAILY_CAUSE_LIST',
    listTypeName: 'Civil Daily Cause List',
    contentDate: '2022-03-24T07:36:35',
    locationId: '5',
    artefactId: 'valid-artefact',
    dateRange: 'Invalid DateTime to Invalid DateTime',
    contDate: '24 Mar 2022'
};

sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(mockArtefact);

describe('List helper', () => {
    describe('hearing has party', () => {
        it('Hearing should have party', () => {
            const rawData = fs.readFileSync(
                path.resolve(__dirname, '../mocks/hearingparty/crownDailyList.json'),
                'utf-8'
            );
            expect(hearingHasParty(JSON.parse(rawData))).toBeTruthy();
        });

        it('Hearing should have no party', () => {
            const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/crownDailyList.json'), 'utf-8');
            expect(hearingHasParty(JSON.parse(rawData))).toBeFalsy();
        });
    });

    describe('is valid list', () => {
        it('should return true if the list data and metadata are valid', () => {
            const listData = 'Test data';
            const metaData = 'Test data';

            expect(isValidList(listData, metaData)).toBeTruthy();
        });

        it('should return false if the list data is missing', () => {
            const listData = null;
            const metaData = 'Test data';

            expect(isValidList(listData, metaData)).toBeFalsy();
        });

        it('should return false if the metadata is missing', () => {
            const listData = 'Test data';
            const metaData = null;

            expect(isValidList(listData, metaData)).toBeFalsy();
        });

        it('should return false if the list data status code is 404', () => {
            const listData = HttpStatusCode.NotFound;
            const metaData = 'Test data';

            expect(isValidList(listData, metaData)).toBeFalsy();
        });

        it('should return false if the metadata status code is 404', () => {
            const listData = 'Test data';
            const metaData = HttpStatusCode.NotFound;

            expect(isValidList(listData, metaData)).toBeFalsy();
        });
    });

    describe('format metadata list type', () => {
        it('should return formatted list type', () => {
            const metaData = { listType: 'TEST_LIST_TYPE' };

            expect(formatMetaDataListType(metaData)).toBe('test-list-type');
        });

        it('should return empty string for list type if metadata is null', () => {
            expect(formatMetaDataListType(null)).toBe('');
        });

        it('should return empty string for list type if metadata not found', () => {
            expect(formatMetaDataListType(HttpStatusCode.NotFound)).toBe('');
        });
    });

    describe('is valid list type', () => {
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

    describe('adding list details to an array', () => {
        it('Should add list details to an array', async () => {
            const expectedResult = [
                {
                    listType: 'CIVIL_DAILY_CAUSE_LIST',
                    listTypeName: 'Civil Daily Cause List',
                    contentDate: '2022-03-24T07:36:35',
                    locationId: '5',
                    artefactId: 'valid-artefact',
                    dateRange: 'Invalid DateTime to Invalid DateTime',
                    contDate: '24 Mar 2022'
                },
            ];
            const list = [];
            await addListDetailsToArray('artfactId', 1, list);
            expect(list).toEqual(expectedResult);
        });
    });
});
