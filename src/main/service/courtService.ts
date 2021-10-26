import { CourtRequests } from '../resources/requests/courtRequests';
import {Court} from '../models/court';

const courtRequest = new CourtRequests();

export class CourtService {
  private static generateAlphabetObject(): object {
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

  public async generateAlphabetisedCourtList(): Promise<object> {
    const courtsList = await this.fetchAllCourts();
    const alphabetisedCourtList = CourtService.generateAlphabetObject();

    //Then loop through each court, and add it to the list
    courtsList.forEach(item => {
      if (item.hearings !== 0) {
        const courtName = item.name;
        alphabetisedCourtList[courtName.charAt(0).toUpperCase()][courtName] = {
          id: item.courtId,
          hearings: item.hearings,
        };
      }
    });
    return alphabetisedCourtList;
  }

  public async generateAlphabetisedCrownCourtList(): Promise<object> {
    const filter = ['jurisdiction'];
    const value = ['crown court'];
    const courtsList= await courtRequest.getFilteredCourts(filter, value);
    const alphabetisedCourtList = CourtService.generateAlphabetObject();

    courtsList.forEach(item => {
      const courtName = item.name;
      alphabetisedCourtList[courtName.charAt(0).toUpperCase()][courtName] = {
        id: item.courtId,
      };
    });
    return alphabetisedCourtList;
  }

  /*
  * TODO:
  *   Merge generateCrownCourtArray & generateCourtsAlphabetObject into one,
  *   once BE returns courts list.
  *   Pass into function courtsList
  */
  public async generateCourtsAlphabetObject(): Promise<object> {
    let courtsList: Array<Court> = await new CourtActions(_api).getCourtsList();
    const alphabetOptions = CourtService.generateAlphabetObject();
    courtsList = new InputFilterService().alphabetiseResults(courtsList, 'name');
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
