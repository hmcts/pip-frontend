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
    const filter = ['jurisdiction'];
    const value = ['crown court'];
    return this.generateFilteredAlphabetisedCourtList(filter, value);
  }

  public async generateFilteredAlphabetisedCourtList(filters: string[], values: string[]): Promise<object> {
    return this.generateAlphabetisedCourtList(await courtRequest.getFilteredCourts(filters, values));
  }

  private generateAlphabetisedCourtList(listToAlphabetise: Array<Court>): object {
    const alphabetisedCourtList = CourtService.generateAlphabetObject();

    listToAlphabetise.forEach(item => {
      const courtName = item.name;
      alphabetisedCourtList[courtName.charAt(0).toUpperCase()][courtName] = {
        id: item.courtId,
      };
    });
    return alphabetisedCourtList;
  }

  public generateCourtsAlphabetObject(courtsList: any): object {
    const alphabetOptions = CourtService.generateAlphabetObject();

    // Then loop through each court, and add it to the list
    courtsList.forEach(item => {
      const courtName = item.name as string;
      alphabetOptions[courtName.charAt(0).toUpperCase()][courtName] = {
        id: item.courtId,
        jurisdiction: item.jurisdiction,
        region: item.location,
      };
    });
    return alphabetOptions;
  }
}
