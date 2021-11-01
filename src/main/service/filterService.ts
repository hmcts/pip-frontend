import {Court} from '../models/court';

export class FilterService {
  public getFilterValueOptions(filterName: string, list: Array<Court>): string[] {
    return [...new Set(list.map(court => court[filterName.toLowerCase()]))];
  }

  public buildFilterValueOptions(filterNames: string[], list, selectedFilters: string[]): object {
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
}
