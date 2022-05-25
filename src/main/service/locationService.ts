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
    return await locationRequest.getAllLocations();
  }

  public async getCourtById(locationId: number): Promise<Location> {
    return await locationRequest.getLocation(locationId);
  }

  public async getCourtByName(courtName: string): Promise<Location> {
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
