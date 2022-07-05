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

  public async fetchAllLocations(): Promise<Array<Location>> {
    return this.initalizeLocationsForALanguage(await locationRequest.getAllLocations());
  }

  private initalizeLocationsForALanguage(locations: Array<Location>): Array<Location> {
    let locationsBaseOnLanguage= [];

    locations.forEach(value => {
      let locationInfo: Location;
      locationInfo = {locationId: value['locationId'], name:  value['welshName'],
        jurisdiction: value['welshJurisdiction'], region: value['welshRegion'],
        hearingList: Array<any>(), hearings: null, location: ''}

      locationsBaseOnLanguage.push(locationInfo);
    });

    return locationsBaseOnLanguage;
  }

  public async getLocationById(locationId: number): Promise<Location> {
    return await locationRequest.getLocation(locationId);
  }

  public async getLocationByName(courtName: string): Promise<Location> {
    return await locationRequest.getLocationByName(courtName);
  }

  public async generateAlphabetisedAllCourtList(): Promise<object> {
    return this.generateAlphabetisedCourtList(await this.fetchAllLocations());
  }

  public async generateAlphabetisedCrownCourtList(): Promise<object> {
    const regions = '';
    const jurisdictions = 'Crown';
    return this.generateFilteredAlphabetisedCourtList(regions, jurisdictions);
  }

  public async generateFilteredAlphabetisedCourtList(regions: string, jurisdictions: string): Promise<object> {
    return this.generateAlphabetisedCourtList(await locationRequest.getFilteredCourts(regions, jurisdictions));
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
}
