import { LocationService } from '../../../main/service/LocationService';
import sinon from 'sinon';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { LocationRequests } from '../../../main/resources/requests/LocationRequests';

const courtService = new LocationService();

const courtRequest = LocationRequests.prototype;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const hearingsData = JSON.parse(rawData);

sinon.stub(courtRequest, 'getAllLocations').returns(hearingsData);
const stubCourt = sinon.stub(courtRequest, 'getLocation');
const stubCourtByName = sinon.stub(courtRequest, 'getLocationByName');
const stubCourtsFilter = sinon.stub(courtRequest, 'getFilteredCourts');
const stubCourtDeletion = sinon.stub(courtRequest, 'deleteCourt');
const stubLocationMetadata = sinon.stub(courtRequest, 'getLocationMetadata');
const stubAddLocationMetadata = sinon.stub(courtRequest, 'addLocationMetadata');
const stubUpdateLocationMetadata = sinon.stub(courtRequest, 'updateLocationMetadata');
const stubDeleteLocationMetadata = sinon.stub(courtRequest, 'deleteLocationMetadata');

const validKeysCount = 26;
const alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];

const locations = [
    {
        locationId: 1,
    },
];

const validCourt = "Abergavenny Magistrates' Court";
const validWelshCourt = 'Llys Ynadon y Fenni';
const englishLanguage = 'en';
const welshLanguage = 'cy';
const englishLanguageFile = 'sscs-daily-list';
const deletionResponse = { exists: true, errorMessage: 'test' };
const adminUserId = '1234';

const crown = 'Crown';
const magistrates = 'Magistrates';

const locationId = 1;
const locationIdForFailedRequest = 2;
const locationMetadataId = '123-456';
const locationMetadataIdForFailedRequest = '123-457';

const locationMetadataEnglishCautionMessage = 'English caution message';
const locationMetadataWelshCautionMessage = 'Welsh caution message';
const locationMetadataEnglishNoListMessage = 'English no list message';
const locationMetadataWelshNoListMessage = 'Welsh no list message';

const locationMetadata = {
    locationMetadataId: locationMetadataId,
    locationId: locationId,
    cautionMessage: locationMetadataEnglishCautionMessage,
    welshCautionMessage: locationMetadataWelshCautionMessage,
    noListMessage: locationMetadataEnglishNoListMessage,
    welshNoListMessage: locationMetadataWelshNoListMessage,
};

stubCourtsFilter.withArgs('', crown, englishLanguage).returns(hearingsData);
stubCourtsFilter.withArgs('', magistrates, englishLanguage).returns([]);
stubCourt.withArgs(1).returns(hearingsData[0]);
stubCourtByName.withArgs(validCourt).returns(hearingsData[0]);
stubCourtByName.withArgs(validWelshCourt).returns(hearingsData[0]);
stubCourtDeletion.withArgs(1, adminUserId).returns(deletionResponse);
stubCourtDeletion.withArgs(2, adminUserId).returns(null);

describe('Court Service', () => {
    it('should return all courts', async () => {
        expect(await courtService.fetchAllLocations(englishLanguage)).to.equal(hearingsData);
    });

    it('should return welsh courts name', async () => {
        const data = await courtService.fetchAllLocations('cy');
        expect(data[0].name).to.equal(hearingsData[0]['welshName']);
    });

    it('should return welsh courts region', async () => {
        const data = await courtService.fetchAllLocations('cy');
        expect(data[0].region).to.equal(hearingsData[0]['welshRegion']);
    });

    it('should return welsh courts jurisdiction', async () => {
        const data = await courtService.fetchAllLocations('cy');
        expect(data[0].jurisdiction).to.equal(hearingsData[0]['welshJurisdiction']);
    });

    it('should return found court for id', async () => {
        expect(await courtService.getLocationById(1)).to.equal(hearingsData[0]);
    });

    it('should return empty court for invalid id', async () => {
        stubCourt.withArgs(100).returns(null);
        expect(await courtService.getLocationById(100)).to.equal(null);
    });

    it('should return found court for court name match', async () => {
        expect(await courtService.getLocationByName(validCourt, englishLanguage)).to.equal(hearingsData[0]);
    });

    it('should return found court for welsh court name match', async () => {
        expect(await courtService.getLocationByName(validWelshCourt, welshLanguage)).to.equal(hearingsData[0]);
    });

    it('should return null for no name match', async () => {
        stubCourtByName.withArgs('test', englishLanguage).returns(null);
        expect(await courtService.getLocationByName('test', englishLanguage)).to.equal(null);
    });

    it('should return null for no name match', async () => {
        stubCourtByName.withArgs('test', welshLanguage).returns(null);
        expect(await courtService.getLocationByName('test', welshLanguage)).to.equal(null);
    });

    it('should return found court name in for english', async () => {
        expect(await courtService.findCourtName(hearingsData[0], englishLanguage, englishLanguageFile)).to.equal(
            "Abergavenny Magistrates' Court"
        );
    });

    it('should return found court name in for welsh', async () => {
        expect(await courtService.findCourtName(hearingsData[0], welshLanguage, englishLanguageFile)).to.equal(
            'Llys Ynadon y Fenni'
        );
    });

    it('should return missing court for english if court is not found', async () => {
        expect(await courtService.findCourtName(null, englishLanguage, englishLanguageFile)).to.equal('Missing Court');
    });

    it('should return missing court for welsh if court is not found', async () => {
        expect(await courtService.findCourtName(null, welshLanguage, englishLanguageFile)).to.equal('Llys ar Goll');
    });

    it(`should return object with ${validKeysCount} keys`, async () => {
        const data = await courtService.generateAlphabetisedAllCourtList(englishLanguage);
        expect(Object.keys(data).length).to.equal(validKeysCount);
    });

    it('should have have all letters of the alphabet as keys', async () => {
        const data = await courtService.generateAlphabetisedAllCourtList(englishLanguage);
        expect(Object.keys(data)).to.deep.equal(alphabet);
    });

    it('should have keys with courts alphabetically assigned to them', async () => {
        const data = await courtService.generateAlphabetisedAllCourtList(englishLanguage);
        expect(validCourt in data['A']).to.be.true;
    });

    it(`should have filtered a ${validCourt} key`, async () => {
        const data = await courtService.generateFilteredAlphabetisedCourtList('', crown, englishLanguage);
        expect(validCourt in data['A']).to.be.true;
    });

    it(`should return object with ${validKeysCount} keys filtered`, async () => {
        const data = await courtService.generateFilteredAlphabetisedCourtList('', crown, englishLanguage);
        expect(Object.keys(data).length).to.equal(validKeysCount);
    });

    it(`should return empty filtered courts`, async () => {
        const data = await courtService.generateFilteredAlphabetisedCourtList('', magistrates, englishLanguage);
        expect(Object.keys(data).length).to.equal(validKeysCount);
        expect(data['A']).to.be.empty;
    });

    it('should return sorted courts list', () => {
        const sorted = courtService.sortCourtsAlphabetically(hearingsData);
        expect(sorted[0].name).to.equal("Abergavenny Magistrates' Court");
        expect(sorted[1].name).to.equal('Accrington County Court');
        expect(sorted[2].name).to.equal("Accrington Magistrates' Court");
        expect(sorted[sorted.length - 1].name).to.equal('West London Court no hearings');
    });

    it('it should return empty list if there are no courts to sort', () => {
        expect(courtService.sortCourtsAlphabetically([])).to.deep.equal([]);
    });

    it('it should return list as it is if there is only 1 court in the list', () => {
        expect(courtService.sortCourtsAlphabetically([hearingsData[0]])).to.deep.equal([hearingsData[0]]);
    });

    it('should find court jurisdiction types', async () => {
        const result = await courtService.findCourtJurisdictionTypes(locations);
        expect(result[0]).contains(hearingsData[0]['jurisdictionType']);
    });

    describe('delete location', () => {
        it('should return a message if location is deleted', async () => {
            const payload = await courtService.deleteLocationById(1, adminUserId);
            expect(payload).to.deep.equal(deletionResponse);
        });

        it('should return null if location delete failed', async () => {
            const payload = await courtService.deleteLocationById(2, adminUserId);
            expect(payload).to.deep.equal(null);
        });
    });

    describe('Location metadata', () => {
        stubLocationMetadata.withArgs(locationId).returns(locationMetadata);
        stubLocationMetadata.withArgs(locationIdForFailedRequest).returns(null);

        stubAddLocationMetadata
            .withArgs({
                locationMetadataId: '',
                locationId: locationId,
                cautionMessage: locationMetadataEnglishCautionMessage,
                welshCautionMessage: locationMetadataWelshCautionMessage,
                noListMessage: locationMetadataEnglishNoListMessage,
                welshNoListMessage: locationMetadataWelshNoListMessage,
            })
            .returns(true);
        stubAddLocationMetadata
            .withArgs({
                locationMetadataId: '',
                locationId: locationIdForFailedRequest,
                cautionMessage: locationMetadataEnglishCautionMessage,
                welshCautionMessage: locationMetadataWelshCautionMessage,
                noListMessage: locationMetadataEnglishNoListMessage,
                welshNoListMessage: locationMetadataWelshNoListMessage,
            })
            .returns(false);

        stubUpdateLocationMetadata.withArgs(locationMetadataId).returns(true);
        stubUpdateLocationMetadata.withArgs(locationMetadataIdForFailedRequest).returns(false);

        stubDeleteLocationMetadata.withArgs(locationMetadataId).returns(true);
        stubDeleteLocationMetadata.withArgs(locationMetadataIdForFailedRequest).returns(false);

        it('should return location metadata by Location if location exists', async () => {
            let locationMetadata = await courtService.getLocationMetadata(1);
            expect(locationMetadata).is.not.undefined;
            expect(locationMetadata).is.not.empty;
            expect(locationMetadata.cautionMessage).is.not.empty;
            expect(locationMetadata.welshCautionMessage).is.not.empty;
            expect(locationMetadata.noListMessage).is.not.empty;
            expect(locationMetadata.welshNoListMessage).is.not.empty;

            locationMetadata = await courtService.getLocationMetadata(2);
            expect(locationMetadata).is.null;
        });

        it('should add location metadata if correct data provided', async () => {
            expect(
                await courtService.addLocationMetadata(
                    locationId,
                    locationMetadataEnglishCautionMessage,
                    locationMetadataWelshCautionMessage,
                    locationMetadataEnglishNoListMessage,
                    locationMetadataWelshNoListMessage,
                    adminUserId
                )
            ).is.true;
            expect(
                await courtService.addLocationMetadata(
                    locationIdForFailedRequest,
                    locationMetadataEnglishCautionMessage,
                    locationMetadataWelshCautionMessage,
                    locationMetadataEnglishNoListMessage,
                    locationMetadataWelshNoListMessage,
                    adminUserId
                )
            ).is.false;
        });

        it('should update location metadata if correct data provided', async () => {
            expect(
                await courtService.updateLocationMetadata(
                    locationMetadataId,
                    locationId,
                    locationMetadataEnglishCautionMessage,
                    locationMetadataWelshCautionMessage,
                    locationMetadataEnglishNoListMessage,
                    locationMetadataWelshNoListMessage,
                    adminUserId
                )
            ).is.true;
            expect(
                await courtService.updateLocationMetadata(
                    locationMetadataIdForFailedRequest,
                    locationId,
                    locationMetadataEnglishCautionMessage,
                    locationMetadataWelshCautionMessage,
                    locationMetadataEnglishNoListMessage,
                    locationMetadataWelshNoListMessage,
                    adminUserId
                )
            ).is.false;
        });

        it('should delete location metadata', async () => {
            expect(await courtService.deleteLocationMetadata(locationMetadataId, adminUserId)).is.true;
            expect(await courtService.deleteLocationMetadata(locationMetadataIdForFailedRequest, adminUserId)).is
                .false;
        });
    });
});
