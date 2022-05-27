import { CourtRequests } from '../resources/requests/courtRequests';
import { Court } from '../models/court';

const courtRequest = new CourtRequests();

export class CourtService {
  public static generateAlphabetObject(): object {
    // create the object for the possible alphabet options
    const alphabetOptions = {};

    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i);
      alphabetOptions[letter] = {};
    }

    return alphabetOptions;
  }

  public sortCourtsAlphabetically(courtsList: Court[]): Court[] {
    return courtsList.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }

  public async fetchAllCourts(): Promise<Array<Court>> {
    return await courtRequest.getAllCourts();
  }

  public async getCourtById(courtId: number): Promise<Court> {
    return await courtRequest.getCourt(courtId);
  }

  public async getCourtByName(courtName: string): Promise<Court> {
    return await courtRequest.getCourtByName(courtName);
  }

  public async generateAlphabetisedAllCourtList(): Promise<object> {
    return this.generateAlphabetisedCourtList(await this.fetchAllCourts());
  }

  public async generateAlphabetisedCrownCourtList(): Promise<object> {
    const regions = '';
    const jurisdictions = 'Crown Court';
    return this.generateFilteredAlphabetisedCourtList(regions, jurisdictions);
  }

  public async generateFilteredAlphabetisedCourtList(regions: string, jurisdictions: string): Promise<object> {
    return this.generateAlphabetisedCourtList(await courtRequest.getFilteredCourts(regions, jurisdictions));
  }

  private generateAlphabetisedCourtList(listToAlphabetise: Array<Court>): object {
    const alphabetisedCourtList = CourtService.generateAlphabetObject();
    const sortedCourtsList = this.sortCourtsAlphabetically(listToAlphabetise);

    sortedCourtsList.forEach(item => {
      const courtName = item.name;
      alphabetisedCourtList[courtName.charAt(0).toUpperCase()][courtName] = {
        id: item.locationId,
      };
    });
    return alphabetisedCourtList;
  }
}
