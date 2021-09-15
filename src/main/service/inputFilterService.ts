import { JSONArray } from 'puppeteer';

let courtsResults;
let searchResults;

export class InputFilterService {
  public findCourts(searchInput, checkAgainst, courtList): JSONArray {
    searchResults = [];
    if (!this.checkNotNullOrEmpty(searchInput)) {
      return searchResults;
    }
    courtsResults = courtList;
    checkAgainst.forEach(item => {
      this.checkInputAgainstSearchValue(searchInput, item);
    });
    return this.alphabetiseResults(searchResults, 'name');
  }

  private checkNotNullOrEmpty(value): boolean {
    return value !== undefined && value !== '';
  }

  private checkInputAgainstSearchValue(searchInput, item): void {
    courtsResults.filter(i => i[item].toLowerCase().indexOf(searchInput.toLowerCase()) !== -1).forEach(result => searchResults.push(result));
  }

  public alphabetiseResults(unsortedArray: JSONArray, leadValue): JSONArray {
    return unsortedArray.sort((a, b) => a[leadValue].localeCompare(b[leadValue]));
  }

  public numericallySortResults(unsortedArray: JSONArray, leadValue): JSONArray {
    return unsortedArray.sort((a, b) => a[leadValue]-b[leadValue]);
  }

}
