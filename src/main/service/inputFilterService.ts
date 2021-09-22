//TODO: replace with object model from common library
declare type Serializable = number | string | boolean | null | bigint;


let courtsResults;
let searchResults;

export class InputFilterService {

  public findCourts(searchInput, checkAgainst, courtList): Serializable[] {
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

  public alphabetiseResults(unsortedArray: Serializable[], leadValue): Serializable[] {
    return unsortedArray.sort((a, b) => a[leadValue].localeCompare(b[leadValue]));
  }

  public numericallySortResults(unsortedArray: Serializable[], leadValue): Serializable[] {
    return unsortedArray.sort((a, b) => a[leadValue]-b[leadValue]);
  }

}
