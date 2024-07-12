import { FilterService } from './FilterService';
import url from 'url';

const filterService = new FilterService();

export const replaceRegex = /[\s,]/g;
export const londonArea = 'London Postcodes';
export const londonPostalAreaCodes = ['N', 'NW', 'E', 'EC', 'SE', 'SW', 'W', 'WC'];

export class SjpFilterService {
    public generateFilterValues(filterValuesQuery: string | string[], clearQuery: string): string[] {
        let filterValues = filterService.stripFilters(filterValuesQuery);

        if (clearQuery) {
            filterValues = filterService.handleFilterClear(filterValues, clearQuery);
        }

        return filterValues;
    }

    public filterSjpCase(sjpCase: any, postcodeFilterValues: string[], prosecutorFilterValues: string[]): boolean {
        const formattedPostcode = sjpCase.postcode.split(' ', 2)[0];
        const postalAreaCode = sjpCase.postcode.split(/\d/)[0];
        const formattedProsecutor = sjpCase.prosecutorName.replace(replaceRegex, '');

        // When both postcode and prosecutor filters are selected, the SJP case needs to match both filters
        // to be accepted
        if (postcodeFilterValues.length > 0 && prosecutorFilterValues.length > 0) {
            return prosecutorFilterValues.includes(formattedProsecutor) &&
                (postcodeFilterValues.includes(formattedPostcode) ||
                    this.londonPostcodeFiltered(postcodeFilterValues, postalAreaCode));
        } else if (postcodeFilterValues.length > 0) {
            return postcodeFilterValues.includes(formattedPostcode) ||
                this.londonPostcodeFiltered(postcodeFilterValues, postalAreaCode);
        }
        return prosecutorFilterValues.length > 0 && prosecutorFilterValues.includes(formattedProsecutor);
    }

    public generatePaginationData(
        totalNumberOfCases: number,
        currentPage: number,
        artefactId: string,
        filterValues: string,
        styleGuideUrl: string
    ) {
        const numberOfPages = Math.ceil(totalNumberOfCases / 1000);

        const query = { artefactId: artefactId };
        if (filterValues && filterValues.length > 0) {
            query['filterValues'] = filterValues;
        }

        const baseUrl = url.format({
            pathname: styleGuideUrl,
            query: query,
        });

        const paginationData = {};

        if (currentPage > 1) {
            paginationData['previous'] = { href: baseUrl + '&page=' + (currentPage - 1) };
        }

        if (currentPage != numberOfPages) {
            paginationData['next'] = { href: baseUrl + '&page=' + (currentPage + 1) };
        }

        if (numberOfPages <= 10) {
            paginationData['items'] = this.generatePageOptionsWithoutElipsis(currentPage, numberOfPages, baseUrl);
        } else {
            paginationData['items'] = this.generatePageOptionsWithElipsis(currentPage, numberOfPages, baseUrl);
        }

        return paginationData;
    }

    private generatePageOptionsWithoutElipsis(currentPage: number, numberOfPages: number, baseUrl: string): any[] {
        const items = [];
        for (let i = 1; i <= numberOfPages; i++) {
            items.push(this.generatePageOption(i, i === currentPage, baseUrl + '&page=' + i));
        }
        return items;
    }

    private generatePageOptionsWithElipsis(currentPage: number, numberOfPages: number, baseUrl: string): any[] {
        const items = [];
        items.push(this.generatePageOption(1, 1 === currentPage, baseUrl + '&page=1'));

        if (currentPage > 3) {
            items.push({ ellipsis: true });
        }

        let pageRange = [];
        if (currentPage == 1 || currentPage == 2) {
            pageRange = [2, 3];
        } else if (currentPage == numberOfPages || currentPage == numberOfPages - 1) {
            pageRange = [numberOfPages - 2, numberOfPages - 1];
        } else {
            pageRange = [currentPage - 1, currentPage, currentPage + 1];
        }

        pageRange.forEach(page => {
            items.push(this.generatePageOption(page, page === currentPage, baseUrl + '&page=' + page));
        });

        if (currentPage < numberOfPages - 2) {
            items.push({ ellipsis: true });
        }

        items.push(
            this.generatePageOption(numberOfPages, numberOfPages === currentPage, baseUrl + '&page=' + numberOfPages)
        );

        return items;
    }

    private generatePageOption(numberOfPages: number, isCurrent: boolean, href: string) {
        return {
            number: numberOfPages,
            current: isCurrent,
            href: href,
        };
    }

    private londonPostcodeFiltered(filterValues: string[], postalAreaCode: string) {
        return londonPostalAreaCodes.includes(postalAreaCode) && filterValues.includes(londonArea)
    }
}
