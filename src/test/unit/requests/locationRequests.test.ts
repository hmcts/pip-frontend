import sinon from 'sinon';
import { dataManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { LocationRequests } from '../../../main/resources/requests/locationRequests';
import fs from 'fs';
import path from 'path';

const courtRequests = new LocationRequests();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtList = JSON.parse(rawData);

const errorResponse = {
    response: {
        data: 'test error',
    },
};

const errorMessage = {
    message: 'test',
};

const courtNameSearch = "Abergavenny Magistrates' Court";
const courtWelshNameSearch = 'Llys Ynadon y Fenni';

const stub = sinon.stub(dataManagementApi, 'get');
const courtDeleteStub = sinon.stub(dataManagementApi, 'delete');

const regions = 'london';
const jurisdictions = 'Crown';
const test = 'test';

const welshRegions = 'Llundain';
const welshJurisdictions = 'Goron';

const englishLanguage = 'en';
const welshLanguage = 'cy';
const dummyFile = new Blob(['testCsv']);

const deletionResponse = { exists: true, errorMessage: 'test' };
const adminUserId = 'Test';

describe('Location get requests', () => {
    beforeEach(() => {
        stub.withArgs('/locations/1').resolves({ data: courtList[0] });
        stub.withArgs('/locations/2').rejects(errorResponse);
        stub.withArgs('/locations/4').rejects(errorMessage);
        stub.withArgs('/locations/5').resolves({ data: courtList[4] });

        stub.withArgs(`/locations/name/${courtNameSearch}/language/${englishLanguage}`).resolves({
            data: courtList[0],
        });
        stub.withArgs('/locations/name/test/eng').rejects(errorResponse);
        stub.withArgs('/locations/name/testMes/eng').rejects(errorMessage);

        stub.withArgs(`/locations/name/${courtWelshNameSearch}/language/${welshLanguage}`).resolves({
            data: courtList[0],
        });
        stub.withArgs('/locations/name/test/cy').rejects(errorResponse);
        stub.withArgs('/locations/name/testMes/cy').rejects(errorMessage);

        stub.withArgs('/locations/filter', {
            params: {
                regions: regions,
                jurisdictions: jurisdictions,
                language: englishLanguage,
            },
        }).resolves({ data: courtList });

        stub.withArgs('/locations/filter', {
            params: {
                regions: test,
                jurisdictions: test,
                language: englishLanguage,
            },
        }).rejects(errorResponse);

        stub.withArgs('/locations/filter', {
            params: {
                regions: test,
                jurisdictions: 'error',
                language: englishLanguage,
            },
        }).rejects(errorMessage);

        stub.withArgs('/locations/filter', {
            params: {
                regions: welshRegions,
                jurisdictions: welshJurisdictions,
                language: welshLanguage,
            },
        }).resolves({ data: courtList });

        stub.withArgs('/locations/filter', {
            params: { regions: test, jurisdictions: test, language: welshLanguage },
        }).rejects(errorResponse);

        stub.withArgs('/locations/filter', {
            params: {
                regions: test,
                jurisdictions: 'error',
                language: welshLanguage,
            },
        }).rejects(errorMessage);

        stub.withArgs('/locations').resolves({ data: courtList });

        courtDeleteStub
            .withArgs('/locations/1', {
                headers: { 'x-provenance-user-id': adminUserId },
            })
            .resolves({ data: { exists: true, errorMessage: 'test' } });
        courtDeleteStub
            .withArgs('/locations/2', {
                headers: { 'x-provenance-user-id': adminUserId },
            })
            .rejects(errorResponse);

        courtDeleteStub
            .withArgs('/locations/4', {
                headers: { 'x-provenance-user-id': adminUserId },
            })
            .rejects(errorMessage);

        courtDeleteStub
            .withArgs('/locations/5', {
                headers: { 'x-provenance-user-id': adminUserId },
            })
            .resolves({ data: { exists: false, errorMessage: '' } });
    });

    it('should return court by court id', async () => {
        stub.withArgs('court-1').resolves(null);
        expect(await courtRequests.getLocation(1)).toStrictEqual(courtList[0]);
    });

    it('should set court after response returns data', async () => {
        expect(await courtRequests.getLocation(5)).toStrictEqual(courtList[4]);
    });

    it('should return null if response fails ', async () => {
        expect(await courtRequests.getLocation(2)).toBe(null);
    });

    it('should return null if call fails', async () => {
        expect(await courtRequests.getLocation(4)).toBe(null);
    });

    it('should return court by name', async () => {
        expect(await courtRequests.getLocationByName(courtNameSearch, englishLanguage)).toBe(courtList[0]);
    });

    it('should return null if response fails', async () => {
        expect(await courtRequests.getLocationByName('test', englishLanguage)).toBe(null);
    });

    it('should return null if request fails', async () => {
        expect(await courtRequests.getLocationByName('testReq', englishLanguage)).toBe(null);
    });

    it('should return null if call fails', async () => {
        expect(await courtRequests.getLocationByName('testMes', englishLanguage)).toBe(null);
    });

    it('should return Welsh court by name', async () => {
        expect(await courtRequests.getLocationByName(courtWelshNameSearch, welshLanguage)).toBe(courtList[0]);
    });

    it('should return null for Welsh search if response fails', async () => {
        expect(await courtRequests.getLocationByName('test', welshLanguage)).toBe(null);
    });

    it('should return null for Welsh search if call fails', async () => {
        expect(await courtRequests.getLocationByName('testMes', welshLanguage)).toBe(null);
    });

    it('should return list of courts based on search filter', async () => {
        expect(await courtRequests.getFilteredCourts(regions, jurisdictions, englishLanguage)).toBe(courtList);
    });

    it('should return null if response fails', async () => {
        expect(await courtRequests.getFilteredCourts(test, 'error', englishLanguage)).toBe(null);
    });

    it('should return Welsh list of courts based on search filter', async () => {
        expect(await courtRequests.getFilteredCourts(welshRegions, welshJurisdictions, welshLanguage)).toBe(courtList);
    });

    it('should return null if Welsh request fails', async () => {
        expect(await courtRequests.getFilteredCourts(test, test, welshLanguage)).toBe(null);
    });

    it('should return null if Welsh response fails', async () => {
        expect(await courtRequests.getFilteredCourts(test, 'error', welshLanguage)).toBe(null);
    });

    it('should return list of courts', async () => {
        expect(await courtRequests.getAllLocations()).toBe(courtList);
    });

    it('should return null list of courts for error response', async () => {
        stub.withArgs('/locations').rejects(errorResponse);
        expect(await courtRequests.getFilteredCourts(test, test, englishLanguage)).toBe(null);
    });

    it('should return null list of courts for errored call', async () => {
        stub.withArgs('/locations').rejects(errorMessage);
        stub.withArgs('allCourts').resolves(null);
        expect(await courtRequests.getAllLocations()).toBe(null);
    });

    it('should return null list of courts for errored response', async () => {
        stub.withArgs('/locations').rejects(errorResponse);
        stub.withArgs('allCourts').resolves(null);
        expect(await courtRequests.getAllLocations()).toBe(null);
    });

    it('should not delete the court if active artefact or subscription exists', async () => {
        expect(await courtRequests.deleteCourt(1, adminUserId)).toStrictEqual(deletionResponse);
    });

    it('should return null if response fails ', async () => {
        expect(await courtRequests.deleteCourt(2, adminUserId)).toBe(null);
    });

    it('should return null if request fails', async () => {
        expect(await courtRequests.deleteCourt(4, adminUserId)).toBe(null);
    });

    it('should return exists false if court is deleted', async () => {
        const data = await courtRequests.deleteCourt(5, adminUserId);
        expect(data['exists']).toStrictEqual(false);
    });
});

describe('Get locations csv', () => {
    it('should return locations csv on success', async () => {
        stub.withArgs('/locations/download/csv').resolves({ status: 200, data: dummyFile });
        const response = await courtRequests.getLocationsCsv('1234');
        expect(response).toBe(dummyFile);
    });

    it('should return false on error response', async () => {
        stub.withArgs('/locations/download/csv').rejects(errorResponse);
        const response = await courtRequests.getLocationsCsv('1234');
        expect(response).toBe(null);
    });

    it('should return false on error message', async () => {
        stub.withArgs('/locations/download/csv').rejects(errorMessage);
        const response = await courtRequests.getLocationsCsv('1234');
        expect(response).toBe(null);
    });
});
