import { FilterService } from './FilterService';
import url from 'url';

const filterService = new FilterService();

const replaceRegex = /[\s,]/g;
const londonArea = 'London Postcodes';
const londonPostalAreaCodes = ['N', 'NW', 'E', 'EC', 'SE', 'SW', 'W', 'WC'];

export class SjpFilterService {
    public generateFilterValues(filterValuesQuery, clearQuery): string[] {
        let filterValues = filterService.stripFilters(filterValuesQuery);

        if (clearQuery) {
            filterValues = filterService.handleFilterClear(filterValues, clearQuery);
        }

        return filterValues;
    }

    public filterSjpCase(sjpCase, filterOptions: string[]): boolean {
        const formattedPostcode = sjpCase.postcode.split(' ', 2)[0];
        const postalAreaCode = sjpCase.postcode.split(/\d/)[0];
        const formattedProsecutor = sjpCase.prosecutorName.replace(replaceRegex, '');

        if (
            filterOptions.includes(formattedPostcode) ||
            filterOptions.includes(formattedProsecutor) ||
            (londonPostalAreaCodes.includes(postalAreaCode) && filterOptions.includes(londonArea))
        ) {
            return true;
        }
        return false;
    }

    public generatePaginationData(totalNumberOfCases, currentPage, artefactId, filterValues, page) {
        const numberOfPages = Math.ceil(totalNumberOfCases / 1000);

        const query = { artefactId: artefactId };
        if (filterValues && filterValues.length > 0) {
            query['filterValues'] = filterValues;
        }

        const baseUrl = url.format({
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
                pageRange = [numberOfPages - 2, numberOfPages - 1];
            } else {
                pageRange = [currentPage - 1, currentPage, currentPage + 1];
            }

            pageRange.forEach(page => {
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
