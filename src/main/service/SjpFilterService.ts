import { FilterService } from './FilterService';
import url from "url";

const filterService = new FilterService();

const replaceRegex = /[\s,]/g;
const londonArea = 'London Postcodes';
const londonPostalAreaCodes = ['N', 'NW', 'E', 'EC', 'SE', 'SW', 'W', 'WC'];

export class SjpFilterService {
    /**
     * This method generates the filter options, and filters the cases based on the selected options.
     * @param allCases The cases to filter.
     * @param filterValuesQuery The user selected filters.
     * @param clearQuery Any filters the user has cleared.
     */
    public generateFilters(allCases, filterValuesQuery, clearQuery): any {
        let filterValues = filterService.stripFilters(filterValuesQuery);

        if (clearQuery) {
            filterValues = filterService.handleFilterClear(filterValues, clearQuery);
        }

        const filterOptions = this.buildFilterOptions(allCases, filterValues);

        const caseList = filterValues.length == 0 ? allCases : this.filterCases(allCases, filterOptions);

        return {
            sjpCases: caseList,
            filterOptions: filterOptions,
        };
    }

    /**
     * This method builds the filter options to display on the page.
     * @param data The data to create the filter options from.
     * @param filterValues The set of filter values.
     * @private
     */
    private buildFilterOptions(data, filterValues): any {
        const postcodes = new Set<string>();
        const prosecutors = new Set<string>();

        data.forEach(item => {
            if (item.postcode) {
                postcodes.add(item.postcode);
            }
            if (item.prosecutorName) {
                prosecutors.add(item.prosecutorName);
            }
        });

        const formattedPostcodes = new Set<string>();
        const postalAreaCodes = new Set<string>();

        postcodes.forEach(postcode => {
            formattedPostcodes.add(postcode.split(' ', 2)[0]);
            postalAreaCodes.add(postcode.split(/\d/)[0]);
        });

        const sortedPostcodes = Array.from(formattedPostcodes).sort((a, b) =>
            a.localeCompare(b, 'en', { numeric: true })
        );
        const sortedProsecutors = Array.from(prosecutors).sort((a, b) => a.localeCompare(b));

        const filterStructure = {
            postcodes: [],
            prosecutors: [],
        };

        sortedPostcodes.forEach(formattedPostcode => {
            filterStructure.postcodes.push({
                value: formattedPostcode,
                text: formattedPostcode,
                checked: filterValues.includes(formattedPostcode),
            });
        });

        const hasLondonPostalAreaCode = this.checkForLondonPostalAreaCodes(postalAreaCodes);

        if (hasLondonPostalAreaCode) {
            filterStructure.postcodes.push({
                value: londonArea,
                text: londonArea,
                checked: filterValues.includes(londonArea),
            });
        }

        sortedProsecutors.forEach(prosecutor => {
            const formattedProsecutor = prosecutor.replace(replaceRegex, '');

            filterStructure.prosecutors.push({
                value: formattedProsecutor,
                text: prosecutor,
                checked: filterValues.includes(formattedProsecutor),
            });
        });

        return filterStructure;
    }

    /**
     * This method filters the cases for the SJP list based on the user selected options
     * @param allCases The cases to filter.
     * @param filterOptions The options that have been selected
     * @private
     */
    private filterCases(allCases, filterOptions) {
        return this.doFiltering(
            allCases,
            this.getActiveFilters(filterOptions.postcodes),
            this.getActiveFilters(filterOptions.prosecutors)
        );
    }

    private getActiveFilters(filterOptions): any {
        const activeFilters = [];

        filterOptions
            .filter(item => item.checked)
            .forEach(item => {
                activeFilters.push(item.value);
            });
        return activeFilters;
    }

    private doFiltering(allCases, postcodeFilters, prosecutorFilters) {
        const filteredCases = [];

        allCases.forEach(item => {
            const formattedPostcode = item.postcode.split(' ', 2)[0];
            const postalAreaCode = item.postcode.split(/\d/)[0];
            const formattedProsecutor = item.prosecutorName.replace(replaceRegex, '');

            if (postcodeFilters.length > 0 && prosecutorFilters.length > 0) {
                if (
                    (postcodeFilters.includes(formattedPostcode) && prosecutorFilters.includes(formattedProsecutor)) ||
                    (postcodeFilters.includes(londonArea) &&
                        londonPostalAreaCodes.includes(postalAreaCode) &&
                        prosecutorFilters.includes(formattedProsecutor))
                ) {
                    filteredCases.push(item);
                }
            } else if (postcodeFilters.length > 0) {
                if (
                    postcodeFilters.includes(formattedPostcode) ||
                    (postcodeFilters.includes(londonArea) && londonPostalAreaCodes.includes(postalAreaCode))
                ) {
                    filteredCases.push(item);
                }
            } else if (prosecutorFilters.length > 0 && prosecutorFilters.includes(formattedProsecutor)) {
                filteredCases.push(item);
            }
        });

        return filteredCases;
    }

    /**
     * This method checks whether any of the cases have a postal code prefix that belongs to London.
     * @param postalAreaCodes The list of postal code prefixes from the cases.
     * @private
     */
    private checkForLondonPostalAreaCodes(postalAreaCodes) {
        const postalAreaInLondon = new Set([...londonPostalAreaCodes].filter(element => postalAreaCodes.has(element)));
        return postalAreaInLondon.size > 0;
    }

    public generatePaginationData(sjpCases, currentPage, artefactId, filterValues, page) {
        const numberOfPages = Math.ceil(sjpCases.length / 1000);

        const query = {artefactId: artefactId};
        if (filterValues && filterValues.length > 0) {
            query['filterValues'] = filterValues;
        }

        const baseUrl = url
            .format({
                pathname: page,
                query: query,
            });

        const paginationData = {};

        if (currentPage > 1) {
            paginationData['previous'] = {
                href: baseUrl + '&page=' + (currentPage - 1),
            };
        }

        if (currentPage != numberOfPages) {
            paginationData['next'] = {
                href: baseUrl + '&page=' + (currentPage + 1),
            };
        }

        const items = [];
        if (numberOfPages <= 10) {
            for (let i = 1; i <= numberOfPages; i++) {
                items.push({
                    number: i,
                    current: i === currentPage,
                    href: baseUrl + '&page=' + i,
                });
            }
        } else {
            items.push({
                number: 1,
                current: 1 === currentPage,
                href: baseUrl + '&page=1',
            });

            if (currentPage > 3) {
                items.push({
                    ellipsis: true,
                });
            }

            let pageRange = [];
            if (currentPage == 1 || currentPage == 2) {
                pageRange = [2, 3];
            } else if (currentPage == numberOfPages || currentPage == numberOfPages - 1) {
                pageRange = [numberOfPages - 2, numberOfPages -1];
            } else {
                pageRange = [currentPage - 1, currentPage, currentPage + 1];
            }

            pageRange.forEach((page) => {
                items.push({
                    number: page,
                    current: page === currentPage,
                    href: baseUrl + '&page=' + page,
                });
            });

            if (currentPage < numberOfPages - 2) {
                items.push({
                    ellipsis: true,
                });
            }

            items.push({
                number: numberOfPages,
                current: numberOfPages === currentPage,
                href: baseUrl + '&page=' + numberOfPages,
            });
        }

        paginationData['items'] = items;

        return paginationData;
    }
}
