import {Court} from '../models/court';
import {CourtService} from './courtService';

const filterNames = ['Jurisdiction', 'Region'];

const courtService = new CourtService();

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

      [...finalFilterValueOptions].sort().forEach(value => {
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
      if (selectedFilters.includes(reqQuery)) {
        selectedFilters.splice(selectedFilters.indexOf(reqQuery), 1);
      }
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

  public stripFilters(currentFilters: string): string[] {
    return currentFilters ? currentFilters.split(',') : [];
  }

  public async handleFilterInitialisation(clearQuery: string, filterValuesQuery: string): Promise<object> {
    let filterValues = this.stripFilters(filterValuesQuery);
    if (clearQuery) {
      filterValues = this.handleFilterClear(filterValues, clearQuery);
    }

    const filterOptions = this.buildFilterValueOptions(await courtService.fetchAllCourts(), filterValues);

    let filters ={};
    if(filterValues.length > 0) {
      filters = this.findAndSplitFilters(filterValues, filterOptions);
    }

    const alphabetisedList = filterValues.length == 0 ? await courtService.generateAlphabetisedAllCourtList() :
      await courtService.generateFilteredAlphabetisedCourtList(filters['Region'], filters['Jurisdiction']);

    return {
      alphabetisedList: alphabetisedList,
      filterOptions: filterOptions,
    };
  }
}
