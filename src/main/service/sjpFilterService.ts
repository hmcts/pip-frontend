import { FilterService } from './filterService';

const filterService = new FilterService();

const replaceRegex = /[\s,]/g;

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
            postcodes.add(item.postcode);
            prosecutors.add(item.organisationName);
        });

        const sortedPostcodes = Array.from(postcodes).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
        const sortedProsecutors = Array.from(prosecutors).sort();

        const filterStructure = {
            postcodes: [],
            prosecutors: [],
        };

        sortedPostcodes.forEach(postcode => {
            const formattedPostcode = postcode.replace(replaceRegex, '');

            filterStructure.postcodes.push({
                value: formattedPostcode,
                text: postcode,
                checked: filterValues.includes(formattedPostcode),
            });
        });

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
        const postcodeFilters = [];
        const prosecutorFilters = [];

        filterOptions.postcodes
            .filter(item => item.checked)
            .forEach(item => {
                postcodeFilters.push(item.value);
            });

        filterOptions.prosecutors
            .filter(item => item.checked)
            .forEach(item => {
                prosecutorFilters.push(item.value);
            });

        const filteredCases = [];
        allCases.forEach(item => {
            const formattedPostcode = item.postcode.replace(replaceRegex, '');
            const formattedProsecutor = item.organisationName.replace(replaceRegex, '');

            if (postcodeFilters.length > 0 && prosecutorFilters.length > 0) {
                if (postcodeFilters.includes(formattedPostcode) && prosecutorFilters.includes(formattedProsecutor)) {
                    filteredCases.push(item);
                }
            } else if (postcodeFilters.length > 0 && postcodeFilters.includes(formattedPostcode)) {
                filteredCases.push(item);
            } else if (prosecutorFilters.length > 0 && prosecutorFilters.includes(formattedProsecutor)) {
                filteredCases.push(item);
            }
        });

        return filteredCases;
    }
}
