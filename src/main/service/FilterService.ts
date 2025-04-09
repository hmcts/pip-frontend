import { Location } from '../models/Location';
import { LocationService } from './LocationService';
import jurisdictionTypes from '../resources/jurisdictionTypeLookup.json';
import welshJurisdictionData from '../resources/welshJurisdictionLookup.json';

const jurisdictionFilter = 'Jurisdiction';
const regionFilter = 'Region';
const civilFilter = 'Civil';
const familyFilter = 'Family';
const crimeFilter = 'Crime';
const tribunalFilter = 'Tribunal';
const subJurisdictionFilters = [civilFilter, crimeFilter, familyFilter, tribunalFilter];
const filterNames = [jurisdictionFilter, ...subJurisdictionFilters, regionFilter];
const jurisdictionType = 'jurisdictionType';

const locationService = new LocationService();

export class FilterService {
    private getFilterValueOptions(filterName: string, list: Array<Location>): Array<string>[] {
        return [...new Set(list.map(court => court[filterName.toLowerCase()]))];
    }

    private getAllJurisdictionTypesFromLocationList(list: Array<Location>): Array<string>[] {
        return [...new Set(list.map(court => court[jurisdictionType]))];
    }

    private getPossibleJurisdictionTypes(jurisdiction: string, language: string): string[] {
        const jurisdictionTypeMapping = new Map(Object.entries(jurisdictionTypes));

        if (jurisdictionTypeMapping.has(jurisdiction)) {
            const jurisdictionTypes = jurisdictionTypeMapping.get(jurisdiction);
            if (language == 'cy') {
                const welshJurisdictionMapping = new Map(Object.entries(welshJurisdictionData));
                const welshJurisdictionTypes = [];
                jurisdictionTypes.forEach(value => {
                    if (welshJurisdictionMapping.has(value)) {
                        welshJurisdictionTypes.push(welshJurisdictionMapping.get(value))
                    }
                })
                return welshJurisdictionTypes;
            }
            return jurisdictionTypes;
        }
        return [];
    }

    private getJurisdictionTypeFilterValueOptions(
        filterName: string,
        allJurisdictionTypes: string[],
        language: string
    ) {
        const possibleJurisdictionType = this.getPossibleJurisdictionTypes(filterName, language);
        return allJurisdictionTypes.filter(element => possibleJurisdictionType.includes(element));
    }

    private showJurisdictionTypeFilter(filters: object, filterName: string, filterText: string) {
        if (filters) {
            return filters[filterName].length > 0 || filters[jurisdictionFilter].includes(filterText);
        }
        return false;
    }

    private showFilters(filters: object, language: string) {
        const welshJurisdictionMapping = new Map(Object.entries(welshJurisdictionData));
        return {
            Jurisdiction: true,
            Civil: this.showJurisdictionTypeFilter(
                filters,
                civilFilter,
                language == 'cy' ? welshJurisdictionMapping.get(civilFilter) : civilFilter
            ),
            Family: this.showJurisdictionTypeFilter(
                filters,
                familyFilter,
                language == 'cy' ? welshJurisdictionMapping.get(familyFilter) : familyFilter
            ),
            Crime: this.showJurisdictionTypeFilter(
                filters,
                crimeFilter,
                language == 'cy' ? welshJurisdictionMapping.get(crimeFilter) : crimeFilter
            ),
            Tribunal: this.showJurisdictionTypeFilter(
                filters,
                tribunalFilter,
                language == 'cy' ? welshJurisdictionMapping.get(tribunalFilter) : tribunalFilter
            ),
            Region: true,
        };
    }

    public buildFilterValueOptions(list: Array<Location>, selectedFilters: string[], language: string): object {
        const filterValueOptions = {};
        const allJurisdictionTypes = this.getAllJurisdictionTypesFromLocationList(list);
        filterNames.forEach(filter => {
            filterValueOptions[filter] = {};
            const deduplicatedFilterValueOptions = [];

            const filteredValue =
                filter == jurisdictionFilter || filter == regionFilter
                    ? this.getFilterValueOptions(filter, list)
                    : allJurisdictionTypes;

            filteredValue.forEach(value => {
                if (Array.isArray(value)) {
                    const array = [...value];
                    array.forEach(value => {
                        if (!deduplicatedFilterValueOptions.includes(value) && value !== '') {
                            deduplicatedFilterValueOptions.push(value);
                        }
                    });
                } else if (value) {
                    deduplicatedFilterValueOptions.push(value);
                }
            });

            const finalFilterValueOptions =
                filter == jurisdictionFilter || filter == regionFilter
                    ? deduplicatedFilterValueOptions
                    : this.getJurisdictionTypeFilterValueOptions(filter, deduplicatedFilterValueOptions, language);

            [...finalFilterValueOptions]
                .sort((a, b) => a.localeCompare(b))
                .forEach(value => {
                    //const valueWithoutSpaces = value.replace(/\s+/g, '');
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

    public findAndSplitFilters(filterValues: any[], filterOptions: object): object {
        const filters = {};
        if (filterValues.length > 0) {
            filterNames.forEach(filterName => {
                filters[filterName] = [];
                filterValues.forEach(value => {
                    Object.keys(filterOptions[filterName]).forEach(filterValue => {
                        if (filterOptions[filterName][filterValue].value === value) {
                            filters[filterName].push(value);
                        }
                    });
                });
            });
        }
        return filters;
    }

    public stripFilters(currentFilters: string | string[]): string[] {
        if (currentFilters && currentFilters !== ',') {
            return currentFilters.toString().split(',');
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
            filterValues,
            language
        );

        let filters = null;
        let alphabetisedList = {};
        if (filterValues.length == 0) {
            alphabetisedList = await locationService.generateAlphabetisedAllCourtList(language);
        } else {
            filters = this.findAndSplitFilters(filterValues, filterOptions);
            const welshJurisdictionMapping = new Map(Object.entries(welshJurisdictionData));

            // Add all sub-jurisdictions to jurisdiction field to be passed into the backend for filtering. If
            // sub-jurisdictions exist in the filter the main jurisdiction will not be sent over.
            const allJurisdictionFilters = [];
            subJurisdictionFilters.forEach(jurisdiction => {
                const jurisdictionText = language == 'cy' ? welshJurisdictionMapping.get(jurisdiction) : jurisdiction;
                if (filters[jurisdiction].length > 0) {
                    allJurisdictionFilters.push(...filters[jurisdiction]);
                } else if (filters[jurisdictionFilter].includes(jurisdictionText)) {
                    allJurisdictionFilters.push(jurisdictionText);
                }
            });

            alphabetisedList = await locationService.generateFilteredAlphabetisedCourtList(
                filters[regionFilter].toString(),
                allJurisdictionFilters.toString(),
                language
            );
        }

        return {
            alphabetisedList: alphabetisedList,
            filterOptions: filterOptions,
            showFilters: this.showFilters(filters, language),
        };
    }

    public generateFilterKeyValues(body: string): string {
        const keys = Object.keys(body);
        const values = [];
        keys.forEach(key => values.push(body[key]));
        return Array.prototype.concat.apply([], values);
    }
}
