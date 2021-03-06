import { LocationRequests } from '../resources/requests/locationRequests';
import { Location } from '../models/location';

const locationRequest = new LocationRequests();

export class LocationService {
  public static generateAlphabetObject(): object {
    // create the object for the possible alphabet options
    const alphabetOptions = {};

    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i);
      alphabetOptions[letter] = {};
    }

    return alphabetOptions;
  }

  public sortCourtsAlphabetically(courtsList: Location[]): Location[] {
    return courtsList.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }

  public async fetchAllLocations(language: string): Promise<Array<Location>> {
    return this.initalizeLocationsForLanguage(await locationRequest.getAllLocations(), language);
  }

  private initalizeLocationsForLanguage(locations: Array<Location>, language: string): Array<Location> {
    let locationsBaseOnLanguage= [];

    switch(language) {
      case 'cy': {
        locations.forEach(value => {
          const locationInfo = {
            locationId: (value['locationId'] != null ? value['locationId'] : value.locationId),
            name:  (value['welshName'] != null ? value['welshName'] : value.name),
            jurisdiction: (value['welshJurisdiction'] != null ? value['welshJurisdiction'] : value.jurisdiction),
            region: (value['welshRegion'] != null ? value['welshRegion'] : value.region),
            hearingList: value.hearingList,
            hearings: value.hearings,
            location: value.location,
          };

          locationsBaseOnLanguage.push(locationInfo);
        });
        break;
      }

      default: {
        locationsBaseOnLanguage = locations;
        break;
      }
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

  public async generateFilteredAlphabetisedCourtList(regions: string, jurisdictions: string, language: string): Promise<object> {
    const locations = this.initalizeLocationsForLanguage(await locationRequest.getFilteredCourts(regions, jurisdictions, language), language);
    return this.generateAlphabetisedCourtList(locations);
  }

  private generateAlphabetisedCourtList(listToAlphabetise: Array<Location>): object {
    const alphabetisedCourtList = LocationService.generateAlphabetObject();
    const sortedCourtsList = this.sortCourtsAlphabetically(listToAlphabetise);

    sortedCourtsList.forEach(item => {
      const locationName = item.name;
      alphabetisedCourtList[locationName.charAt(0).toUpperCase()][locationName] = {
        id: item.locationId,
      };
    });
    return alphabetisedCourtList;
  }

  public findCourtName(location: Location, language: string): string {
    let courtName = '';
    if(location == null) {
      switch(language) {
        case 'cy': {
          return 'Llys ar Goll';
        }

        default: {
          return 'Missing Court';
        }
      }
    }

    switch(language) {
      case 'cy': {
        courtName = (location['welshName'] != null ? location['welshName'] : location.name);
        break;
      }

      default: {
        courtName = location.name;
        break;
      }
    }

    return courtName;
  }
}
