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
    return searchResults;
  }

  private checkNotNullOrEmpty(value): boolean {
    return value != undefined || value != '';
  }

  private checkInputAgainstSearchValue(searchInput, item) {
    courtsResults.filter(i => i[item] === searchInput).forEach(result => searchResults.push(result));
  }
}
