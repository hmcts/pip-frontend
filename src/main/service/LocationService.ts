import { LocationRequests } from '../resources/requests/LocationRequests';
import { Location } from '../models/Location';
import { LanguageFileParser } from '../helpers/languageFileParser';
import { AToZHelper } from '../helpers/aToZHelper';
import locationInfo from '../resources/additionalLocationInfoLookup.json';
import { AdditionalLocationInfo } from '../models/AdditionalLocationInfo';
import { LocationMetadata } from '../models/LocationMetadata';

const locationRequest = new LocationRequests();
const languageFileParser = new LanguageFileParser();

export class LocationService {
    public sortCourtsAlphabetically(courtsList: Location[]): Location[] {
        return courtsList.sort((a, b) => (a.name > b.name ? 1 : -1));
    }

    public async fetchAllLocations(language: string): Promise<Array<Location>> {
        return this.initalizeLocationsForLanguage(await locationRequest.getAllLocations(), language);
    }

    private initalizeLocationsForLanguage(locations: Array<Location>, language: string): Array<Location> {
        let locationsBaseOnLanguage = [];

        if (language === 'cy') {
            locations.forEach(value => {
                const locationInfo = {
                    locationId: value['locationId'] ?? value.locationId,
                    name: value['welshName'] ?? value.name,
                    jurisdiction: value['welshJurisdiction'] ?? value.jurisdiction,
                    jurisdictionType: value['welshJurisdictionType'] ?? value.jurisdictionType,
                    region: value['welshRegion'] ?? value.region,
                    location: value.location,
                };

                locationsBaseOnLanguage.push(locationInfo);
            });
        } else {
            locationsBaseOnLanguage = locations;
        }

        return locationsBaseOnLanguage;
    }

    public async getLocationById(locationId: number): Promise<Location> {
        return await locationRequest.getLocation(locationId);
    }

    public async getLocationByName(courtName: string, language: string): Promise<Location> {
        return await locationRequest.getLocationByName(courtName, language);
    }

    public async generateAlphabetisedAllCourtList(language: string): Promise<object> {
        return this.generateAlphabetisedCourtList(await this.fetchAllLocations(language));
    }

    public async generateFilteredAlphabetisedCourtList(
        regions: string,
        jurisdictions: string,
        language: string
    ): Promise<object> {
        const locations = this.initalizeLocationsForLanguage(
            await locationRequest.getFilteredCourts(regions, jurisdictions, language),
            language
        );
        return this.generateAlphabetisedCourtList(locations);
    }

    private generateAlphabetisedCourtList(listToAlphabetise: Array<Location>): object {
        const alphabetisedCourtList = AToZHelper.generateAlphabetObject();
        const sortedCourtsList = this.sortCourtsAlphabetically(listToAlphabetise);

        sortedCourtsList.forEach(item => {
            const locationName = item.name;
            alphabetisedCourtList[locationName.charAt(0).toUpperCase()][locationName] = {
                id: item.locationId,
            };
        });
        return alphabetisedCourtList;
    }

    public findCourtName(location: Location, language: string, languageFile: string): string {
        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
        let courtName = '';
        if (location == null) {
            return languageFileParser.getText(fileJson, null, 'missingCourt');
        }

        if (language === 'cy') {
            courtName = location['welshName'] ?? location.name;
        } else {
            courtName = location.name;
        }
        return courtName;
    }

    public formatCourtValue(court): any {
        const courtItem = { ...court };
        courtItem.jurisdiction = court.jurisdiction.toString();
        courtItem.region = court.region.toString();
        return courtItem;
    }

    public async deleteLocationById(locationId: number, userId: string): Promise<object> {
        return await locationRequest.deleteCourt(locationId, userId);
    }

    public async findCourtJurisdictionTypes(locations): Promise<string[]> {
        const courtJurisdictionTypes = [];
        for (const location of locations) {
            const returnedLocation = await this.getLocationById(location['locationId']);
            if (returnedLocation != null) {
                returnedLocation.jurisdictionType.forEach(value => courtJurisdictionTypes.push(value));
            }
        }

        return courtJurisdictionTypes;
    }

    public getAdditionalLocationInfo(locationId: string) {
        const allLocationInfoMap: Map<string, AdditionalLocationInfo> = new Map(Object.entries(locationInfo));
        return allLocationInfoMap.get(locationId);
    }

    public async addLocationMetadata(
        locationId: number,
        cautionMessage: string,
        welshCautionMessage: string,
        noListMessage: string,
        welshNoListMessage: string,
        userId: string
    ): Promise<boolean> {
        return await locationRequest.addLocationMetadata(
            this.createLocationMetadataPayload(
                '',
                locationId,
                cautionMessage,
                welshCautionMessage,
                noListMessage,
                welshNoListMessage
            ),
            userId
        );
    }

    public async updateLocationMetadata(
        id: string,
        locationId: number,
        cautionMessage: string,
        welshCautionMessage: string,
        noListMessage: string,
        welshNoListMessage: string,
        userId: string
    ): Promise<boolean> {
        return await locationRequest.updateLocationMetadata(
            this.createLocationMetadataPayload(
                id,
                locationId,
                cautionMessage,
                welshCautionMessage,
                noListMessage,
                welshNoListMessage
            ),
            userId
        );
    }

    public async getLocationMetadata(locationId: number): Promise<LocationMetadata> {
        return await locationRequest.getLocationMetadata(locationId);
    }

    public async getLocationMetadataById(id: string): Promise<LocationMetadata> {
        return await locationRequest.getLocationMetadataById(id);
    }

    public async deleteLocationMetadataById(id: string, userId: string): Promise<boolean> {
        return await locationRequest.deleteLocationMetadata(id, userId);
    }

    private createLocationMetadataPayload(
        id: string,
        locationId: number,
        cautionMessage: string,
        welshCautionMessage: string,
        noListMessage: string,
        welshNoListMessage: string
    ): any {
        return {
            locationMetadataId: id,
            locationId: locationId,
            cautionMessage: cautionMessage,
            welshCautionMessage: welshCautionMessage,
            noListMessage: noListMessage,
            welshNoListMessage: welshNoListMessage,
        };
    }
}
