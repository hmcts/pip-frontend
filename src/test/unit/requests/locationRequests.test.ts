import sinon from 'sinon';
import { accountManagementApi, dataManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { LocationRequests } from '../../../main/resources/requests/LocationRequests';
import fs from 'fs';
import path from 'path';

const courtRequests = new LocationRequests();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtList = JSON.parse(rawData);

const locationMetadata = {
    locationMetadataId: '123-456',
    locationId: 1,
    cautionMessage: 'English caution message',
    welshCautionMessage: 'Welsh caution message',
    noListMessage: 'English no list message',
    welshNoListMessage: 'Welsh no list message',
};

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
const stubPost = sinon.stub(dataManagementApi, 'post');
const stubPut = sinon.stub(dataManagementApi, 'put');
const deleteStub = sinon.stub(accountManagementApi, 'delete');

const regions = 'london';
const jurisdictions = 'Crown';
const test = 'test';

const welshRegions = 'Llundain';
const welshJurisdictions = 'Goron';

const englishLanguage = 'en';
const welshLanguage = 'cy';
const dummyFile = new Blob(['testCsv']);

const deletionResponse = { exists: true, errorMessage: 'test' };
const adminUserId = '1234';

describe('Location Request', () => {
    describe('Location get requests', () => {
        beforeEach(() => {
            stub.withArgs('/locations/1').resolves({ data: courtList[0] });
            stub.withArgs('/locations/2').rejects(errorResponse);
            stub.withArgs('/locations/4').rejects(errorMessage);
            stub.withArgs('/locations/5').resolves({ data: courtList[4] });

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
                    headers: { 'x-user-id': adminUserId },
                })
                .resolves({ data: { exists: true, errorMessage: 'test' } });
            courtDeleteStub
                .withArgs('/locations/2', {
                    headers: { 'x-user-id': adminUserId },
                })
                .rejects(errorResponse);

            courtDeleteStub
                .withArgs('/locations/4', {
                    headers: { 'x-user-id': adminUserId },
                })
                .rejects(errorMessage);

            courtDeleteStub
                .withArgs('/locations/5', {
                    headers: { 'x-user-id': adminUserId },
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
            stub.withArgs('/locations/name').resolves({ data: courtList[0] });
            expect(await courtRequests.getLocationByName(courtNameSearch, englishLanguage)).toBe(courtList[0]);
        });

        it('should return null if response fails', async () => {
            stub.withArgs('/locations/name').rejects(errorResponse);
            expect(await courtRequests.getLocationByName(courtNameSearch, englishLanguage)).toBe(null);
        });

        it('should return null if request fails', async () => {
            stub.withArgs('/locations/name').rejects(errorMessage);
            expect(await courtRequests.getLocationByName(courtNameSearch, englishLanguage)).toBe(null);
        });

        it('should return Welsh court by name', async () => {
            stub.withArgs('/locations/name').resolves({ data: courtList[0] });
            expect(await courtRequests.getLocationByName(courtWelshNameSearch, welshLanguage)).toBe(courtList[0]);
        });

        it('should return null for Welsh search if response fails', async () => {
            stub.withArgs('/locations/name').rejects(errorResponse);
            expect(await courtRequests.getLocationByName(courtWelshNameSearch, welshLanguage)).toBe(null);
        });

        it('should return null for Welsh search if call fails', async () => {
            stub.withArgs('/locations/name').rejects(errorMessage);
            expect(await courtRequests.getLocationByName(courtWelshNameSearch, welshLanguage)).toBe(null);
        });

        it('should return list of courts based on search filter', async () => {
            expect(await courtRequests.getFilteredCourts(regions, jurisdictions, englishLanguage)).toBe(courtList);
        });

        it('should return empty array if response fails', async () => {
            expect(await courtRequests.getFilteredCourts(test, 'error', englishLanguage)).toStrictEqual([]);
        });

        it('should return Welsh list of courts based on search filter', async () => {
            expect(await courtRequests.getFilteredCourts(welshRegions, welshJurisdictions, welshLanguage)).toBe(
                courtList
            );
        });

        it('should return empty array if Welsh request fails', async () => {
            expect(await courtRequests.getFilteredCourts(test, test, welshLanguage)).toStrictEqual([]);
        });

        it('should return empty array if Welsh response fails', async () => {
            expect(await courtRequests.getFilteredCourts(test, 'error', welshLanguage)).toStrictEqual([]);
        });

        it('should return list of courts', async () => {
            expect(await courtRequests.getAllLocations()).toBe(courtList);
        });

        it('should return empty list of courts for error response', async () => {
            stub.withArgs('/locations').rejects(errorResponse);
            expect(await courtRequests.getFilteredCourts(test, test, englishLanguage)).toStrictEqual([]);
        });

        it('should return empty list of courts for errored call', async () => {
            stub.withArgs('/locations').rejects(errorMessage);
            stub.withArgs('allCourts').resolves(null);
            expect(await courtRequests.getAllLocations()).toStrictEqual([]);
        });

        it('should return empty list of courts for errored response', async () => {
            stub.withArgs('/locations').rejects(errorResponse);
            stub.withArgs('allCourts').resolves(null);
            expect(await courtRequests.getAllLocations()).toStrictEqual([]);
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

    describe('Location metadata', () => {
        describe('Get Location metadata', () => {
            beforeEach(() => {
                stub.withArgs('/location-metadata/location/1').resolves({ data: locationMetadata });
                stub.withArgs('/location-metadata/location/2').rejects(errorResponse);
                stub.withArgs('/location-metadata/location/4').rejects(errorMessage);
            });

            it('should return location metadata by location id', async () => {
                expect(await courtRequests.getLocationMetadata(1)).toStrictEqual(locationMetadata);
            });

            it('should return null if response fails ', async () => {
                expect(await courtRequests.getLocationMetadata(2)).toBe(null);
            });

            it('should return null if call fails', async () => {
                expect(await courtRequests.getLocationMetadata(4)).toBe(null);
            });
        });
        describe('Add Location metadata', () => {
            it('should add location metadata', async () => {
                stubPost.withArgs('/location-metadata').withArgs(locationMetadata).resolves(true);
                expect(await courtRequests.addLocationMetadata(locationMetadata, '123')).toBe(true);
            });

            it('should return null if response fails ', async () => {
                stubPost.withArgs('/location-metadata').rejects(errorResponse);
                expect(await courtRequests.addLocationMetadata({}, '123')).toBe(false);
            });

            it('should return null if call fails', async () => {
                stubPost.withArgs('/location-metadata').rejects(errorMessage);
                expect(await courtRequests.addLocationMetadata({}, '123')).toBe(false);
            });
        });
        describe('Update Location metadata', () => {
            it('should update location metadata', async () => {
                stubPut.withArgs('/location-metadata/123-456').withArgs(locationMetadata).resolves(true);
                expect(await courtRequests.updateLocationMetadata('123-456', locationMetadata, '123')).toBe(true);
            });

            it('should return null if response fails ', async () => {
                stubPut.withArgs('/location-metadata/123-457').rejects(errorResponse);
                expect(await courtRequests.updateLocationMetadata('123-457', {}, '123')).toBe(false);
            });

            it('should return null if call fails', async () => {
                stubPut.withArgs('/location-metadata/123-458').rejects(errorMessage);
                expect(await courtRequests.updateLocationMetadata('123-458', {}, '123')).toBe(false);
            });
        });
        describe('Delete location meta data', () => {
            it('should return true if provided data is valid', async () => {
                deleteStub.withArgs('/location-metadata/123-456').resolves(true);
                expect(await courtRequests.deleteLocationMetadata('123-456', '1234-1234')).toBe(true);
            });

            it('should return null if response fails ', async () => {
                deleteStub.withArgs('/location-metadata/123-457').resolves(false);
                expect(await courtRequests.deleteLocationMetadata('123-457', '1234-1234')).toBe(true);
            });

            it('should return null if call fails', async () => {
                deleteStub.withArgs('/location-metadata/123-458').resolves(false);
                expect(await courtRequests.deleteLocationMetadata('123-458', '1234-1234')).toBe(true);
            });
        });
    });
});
