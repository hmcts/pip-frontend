import { Location } from '../models/location';
import { LocationService } from './locationService';

const filterNames = ['Jurisdiction', 'Region'];

const locationService = new LocationService();

export class FilterService {
    private getFilterValueOptions(filterName: string, list: Array<Location>): string[] {
        return [...new Set(list.map(court => court[filterName.toLowerCase()]))];
    }

    public buildFilterValueOptions(list: Array<Location>, selectedFilters: string[]): object {
        const filterValueOptions = {};
        let finalFilterValueOptions = [];
        filterNames.forEach(filter => {
            filterValueOptions[filter] = {};
            finalFilterValueOptions = [];
            const filteredValue = this.getFilterValueOptions(filter, list);
            filteredValue.forEach(value => {
                if (Array.isArray(value)) {
                    const array = [...value];
                    array.forEach(value => {
                        if (!finalFilterValueOptions.includes(value) && value !== '') {
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

    public splitFilters(filterNames: string[], body: object): object {
        const filterValueOptions = {};
        let jurisdictionFilter = '';
        let regionFilter = '';
        filterNames.forEach(filter => {
            if (body[filter]) {
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

    public findAndSplitFilters(filterValues: any[], filterOptions: object): object {
        const filterValueOptions = {};

        const jurisdictionFilter = [];
        const regionFilter = [];

        if (filterValues.length > 0) {
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
        if (currentFilters && currentFilters !== ',') {
            return currentFilters.split(',');
        }
        return [];
    }

    public async handleFilterInitialisation(
        clearQuery: string,
        filterValuesQuery: string,
        language: string
    ): Promise<object> {
        let filterValues = this.stripFilters(filterValuesQuery);
        if (clearQuery) {
            filterValues = this.handleFilterClear(filterValues, clearQuery);
        }

        const filterOptions = this.buildFilterValueOptions(
            await locationService.fetchAllLocations(language),
            filterValues
        );

        let filters = {};
        if (filterValues.length > 0) {
            filters = this.findAndSplitFilters(filterValues, filterOptions);
        }

        const alphabetisedList =
            filterValues.length == 0
                ? await locationService.generateAlphabetisedAllCourtList(language)
                : await locationService.generateFilteredAlphabetisedCourtList(
                      filters['Region'],
                      filters['Jurisdiction'],
                      language
                  );

        return {
            alphabetisedList: alphabetisedList,
            filterOptions: filterOptions,
        };
    }

    public generateFilterKeyValues(body: string): object {
        const keys = Object.keys(body);
        const values = [];
        keys.forEach(key => values.push(body[key]));
        const filterValues = Array.prototype.concat.apply([], values);

        return filterValues;
    }
}
