import { FilterService } from './filterService';

const filterService = new FilterService();

const replaceRegex = /[\s,]/g;

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

        const caseList =
            filterValues.length == 0 ? allCases : this.filterCases(allCases, londonPostalAreaCodes, filterOptions);

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
            postcodes.add(item.postcode);
            prosecutors.add(item.organisationName);
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
        const sortedProsecutors = Array.from(prosecutors).sort();

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

        const hasLondonPostalAreaCode = this.checkForLondonPostalAreaCodes(londonPostalAreaCodes, postalAreaCodes);

        if (hasLondonPostalAreaCode) {
            filterStructure.postcodes.push({
                value: 'The City of London',
                text: 'The City of London',
                checked: filterValues.includes('The City of London'),
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
     * @param londonPostalAreaCodes The list of postal code prefixes for London.
     * @param filterOptions The options that have been selected
     * @private
     */
    private filterCases(allCases, londonPostalAreaCodes, filterOptions) {
        return this.doFiltering(
            allCases,
            londonPostalAreaCodes,
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

    private doFiltering(allCases, londonPostalAreaCodes, postcodeFilters, prosecutorFilters) {
        const filteredCases = [];
        allCases.forEach(item => {
            const formattedPostcode = item.postcode.split(' ', 2)[0];
            const postalAreaCode = item.postcode.split(/\d/)[0];
            const formattedProsecutor = item.organisationName.replace(replaceRegex, '');

            if (postcodeFilters.length > 0 && prosecutorFilters.length > 0) {
                if (postcodeFilters.includes(formattedPostcode) && prosecutorFilters.includes(formattedProsecutor)) {
                    filteredCases.push(item);
                } else if (
                    postcodeFilters.includes('The City of London') &&
                    londonPostalAreaCodes.includes(postalAreaCode) &&
                    prosecutorFilters.includes(formattedProsecutor)
                ) {
                    filteredCases.push(item);
                }
            } else if (postcodeFilters.length > 0) {
                if (postcodeFilters.includes(formattedPostcode)) {
                    filteredCases.push(item);
                } else if (
                    postcodeFilters.includes('The City of London') &&
                    londonPostalAreaCodes.includes(postalAreaCode)
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
     * @param londonPostalAreaCodes The list of postal code prefixes for London.
     * @param postalAreaCodes The list of postal code prefixes from the cases.
     * @private
     */
    private checkForLondonPostalAreaCodes(londonPostalAreaCodes, postalAreaCodes) {
        const postalAreaInLondon = new Set([...londonPostalAreaCodes].filter(element => postalAreaCodes.has(element)));
        return postalAreaInLondon.size > 0;
    }
}
