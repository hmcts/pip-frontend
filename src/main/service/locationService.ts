import { LocationRequests } from '../resources/requests/locationRequests';
import { Location } from '../models/location';
import { LanguageFileParser } from '../helpers/languageFileParser';
import { AToZHelper } from '../helpers/aToZHelper';

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
                    locationId: value['locationId'] != null ? value['locationId'] : value.locationId,
                    name: value['welshName'] != null ? value['welshName'] : value.name,
                    jurisdiction: value['welshJurisdiction'] != null ? value['welshJurisdiction'] : value.jurisdiction,
                    region: value['welshRegion'] != null ? value['welshRegion'] : value.region,
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

    public async generateAlphabetisedCrownCourtList(language: string): Promise<object> {
        const regions = '';
        const jurisdictions = 'Crown';
        return this.generateFilteredAlphabetisedCourtList(regions, jurisdictions, language);
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
            courtName = location['welshName'] != null ? location['welshName'] : location.name;
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

    public async deleteLocationById(locationId: number, requester: string): Promise<object> {
        return await locationRequest.deleteCourt(locationId, requester);
    }
}
