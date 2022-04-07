import {Court} from '../models/court';

const jurisdictionFilterName = 'Type of court or tribunal';
const filterNames = [{courtField: 'Jurisdiction', filterName: jurisdictionFilterName}, {courtField:'Region', filterName: 'Region'}];

export class FilterService {
  private getFilterValueOptions(filterName: string, list: Array<Court>): string[] {
    return [...new Set(list.map(court => court[filterName.toLowerCase()]))];
  }

  public buildFilterValueOptions(list: Array<Court>, selectedFilters: string[]): object {
    const filterValueOptions = {};
    let finalFilterValueOptions = [];
    filterNames.forEach(filter => {
      filterValueOptions[filter.filterName] = {};
      finalFilterValueOptions = [];
      const filteredValue = this.getFilterValueOptions(filter.courtField, list);
      filteredValue.forEach(value => {
        if(Array.isArray(value)) {
          const array = [...value];
          array.forEach(value => {
            if(!finalFilterValueOptions.includes(value)) {
              finalFilterValueOptions.push(value);
            }
          });
        } else {
          if (value) {
            finalFilterValueOptions.push(value);
          }
        }
      });

      [...finalFilterValueOptions].sort().forEach(value => {
        filterValueOptions[filter.filterName][value] = {
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

  public splitFilters(filterNames: string[], body: object): object{
    const filterValueOptions = {};
    let jurisdictionFilter = '';
    let regionFilter = '';
    filterNames.forEach(filter => {
      if(body[filter]) {
        if (filter === jurisdictionFilterName) {
          jurisdictionFilter = body[filter].toString();
        } else {
          regionFilter = body[filter].toString();
        }
      }
    });
    filterValueOptions[jurisdictionFilterName] = jurisdictionFilter;
    filterValueOptions['Region'] = regionFilter;

    return filterValueOptions;
  }

  public findAndSplitFilters(filterValues: any[], filterOptions: object): object{
    const filterValueOptions = {};

    const jurisdictionFilter = [];
    const regionFilter = [];

    if(filterValues.length > 0) {
      filterNames.forEach(filter => {
        filterValues.forEach(value => {
          Object.keys(filterOptions[filter.filterName]).forEach(filterValue => {
            if (filterOptions[filter.filterName][filterValue].value === value) {
              if (filter.filterName === jurisdictionFilterName) {
                jurisdictionFilter.push(value);
              } else if (filter.filterName === 'Region') {
                regionFilter.push(value);
              }
            }
          });
        });
      });
    }

    filterValueOptions[jurisdictionFilterName] = jurisdictionFilter.toString();
    filterValueOptions['Region'] = regionFilter.toString();

    return filterValueOptions;
  }
}
