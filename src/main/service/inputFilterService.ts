import { CourtActions } from '../resources/actions/courtActions';
import { JSONArray } from 'puppeteer';

const courtActions = new CourtActions();
let courtsResults;
let searchResults;

export class InputFilterService {
  public findCourts(searchInput, checkAgainst): JSONArray {
    searchResults = [];
    if (!this.checkNotNullOrEmpty(searchInput)) {
      return searchResults;
    }
    courtsResults = courtActions.getCourtsList();
    checkAgainst.forEach(item => {
      this.checkInputAgainstSearchValue(searchInput, item);
    });
    return this.alphabetiseResults(searchResults, 'name');
  }

  private checkNotNullOrEmpty(value): boolean {
    return value != undefined && value != '';
  }

  private checkInputAgainstSearchValue(searchInput, item): void {
    courtsResults.filter(i => i[item].toLowerCase() === searchInput.toLowerCase()).forEach(result => searchResults.push(result));
  }

  public alphabetiseResults(unsortedArray: JSONArray, leadValue): JSONArray {
    return unsortedArray.sort((a, b) => a[leadValue].localeCompare(b[leadValue]));
  }

  public numericallySortResults(unsortedArray: JSONArray, leadValue): JSONArray {
    return unsortedArray.sort((a, b) => a[leadValue]-b[leadValue]);
  }

}
