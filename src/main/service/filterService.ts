import {Court} from '../models/court';

const filterNames = ['Jurisdiction', 'Region'];

export class FilterService {
  private getFilterValueOptions(filterName: string, list: Array<Court>): string[] {
    return [...new Set(list.map(court => court[filterName.toLowerCase()]))];
  }

  public buildFilterValueOptions(list: Array<Court>, selectedFilters: string[]): object {
    const filterValueOptions = {};
    filterNames.forEach(filter => {
      filterValueOptions[filter] = {};
      const tempFilter = filter === 'Region' ? 'Location' : filter; //remove once location is changed to region in data
      this.getFilterValueOptions(tempFilter, list).forEach(value => {
        filterValueOptions[filter][value] = {
          value: value,
          text: value,
          checked: selectedFilters.includes(value),
        };
      });
    });
    return filterValueOptions;
  }

  public handleFilterClear(selectedFilters: string[], reqQuery: string): string[] {
    if (reqQuery == 'all') {
      return [];
    } else {
      selectedFilters.splice(selectedFilters.indexOf(reqQuery), 1);
      return selectedFilters;
    }
  }

  public handleKeys(filterOptions: object): string[] {
    const keys = [];
    filterNames.forEach(filter => {
      Object.keys(filterOptions[filter]).forEach(filterValue => {
        if (filterOptions[filter][filterValue].checked) {
          filter === 'Region' ? keys.push('Location') : keys.push(filter);
        }
      });
    });
    return [...new Set(keys.map(key => key))];
  }
}
