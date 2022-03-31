import {Court} from '../models/court';

const filterNames = ['Jurisdiction', 'Region'];

export class FilterService {
  private getFilterValueOptions(filterName: string, list: Array<Court>): string[] {
    return [...new Set(list.map(court => court[filterName.toLowerCase()]))];
  }

  public buildFilterValueOptions(list: Array<Court>, selectedFilters: string[]): object {
    const filterValueOptions = {};
    let finalFilterValueOptions = [];
    filterNames.forEach(filter => {
      filterValueOptions[filter] = {};
      finalFilterValueOptions = [];
      const filteredValue = this.getFilterValueOptions(filter, list);
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

      finalFilterValueOptions.forEach(value => {
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

  public splitFilters(filterNames: string[], body: object): object{
    const filterValueOptions = {};
    let jurisdictionFilter = '';
    let regionFilter = '';
    filterNames.forEach(filter => {
      if(body[filter]) {
        if (filter === 'Jurisdiction') {
          jurisdictionFilter = body[filter].toString();
        } else {
          regionFilter = body[filter].toString();
        }
      }
    });
    filterValueOptions['Jurisdiction'] = jurisdictionFilter;
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
          Object.keys(filterOptions[filter]).forEach(filterValue => {
            if (filterOptions[filter][filterValue].value === value) {
              if (filter === 'Jurisdiction') {
                jurisdictionFilter.push(value);
              } else if (filter === 'Region') {
                regionFilter.push(value);
              }
            }
          });
        });
      });
    }

    filterValueOptions['Jurisdiction'] = jurisdictionFilter.toString();
    filterValueOptions['Region'] = regionFilter.toString();

    return filterValueOptions;
  }
}
