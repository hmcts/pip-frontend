import { londonPostalAreaCodes, londonArea, replaceRegex } from '../../service/SjpFilterService';

export class SjpModel {
    private totalNumberOfCases: number = 0;
    private currentPage: number = 1;
    private postcodes = new Set<string>();
    private prosecutors = new Set<string>();
    private hasLondonPostcodeArea: boolean = false;
    private currentFilterValues: string[] = [];
    private currentPostcodeFilterValues: string[] = [];
    private currentProsecutorFilterValues: string[] = [];
    private postcodeFilters: object;
    private prosecutorFilters: object;
    private filteredCasesForPage: object[] = [];

    ///This value includes filtered cases outside the current page, and is used to work out the total page count.
    private countOfFilteredCases: number = 0;

    addTotalCaseNumber(): void {
        this.totalNumberOfCases++;
    }

    getTotalNumberOfCases(): number {
        return this.totalNumberOfCases;
    }

    setCurrentPage(page: any | undefined): number {
        if (page && Number(page)) {
            this.currentPage = parseInt(page as string);
        }
        return this.currentPage;
    }

    addPostcode(postcode: string): void {
        this.postcodes.add(postcode.split(' ', 2)[0]);

        if (!this.hasLondonPostcodeArea && londonPostalAreaCodes.includes(postcode.split(/\d/)[0])) {
            this.hasLondonPostcodeArea = true;
        }
    }

    getPostcodes(): Set<string> {
        return this.postcodes;
    }

    addProsecutor(prosecutor: string): void {
        this.prosecutors.add(prosecutor);
    }

    getProsecutors(): Set<string> {
        return this.prosecutors;
    }

    containsLondonPostcodeArea(): boolean {
        return this.hasLondonPostcodeArea;
    }

    sortPostcodes(): string[] {
        return Array.from(this.postcodes).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    }

    sortProsecutors(): string[] {
        return Array.from(this.prosecutors).sort((a, b) => a.localeCompare(b));
    }

    setCurrentFilterValues(filterValues: string[]): void {
        this.currentFilterValues = filterValues;
    }

    getCurrentFilterValues(): string[] {
        return this.currentFilterValues;
    }

    getCurrentPostcodeFilterValues(): string[] {
        return this.currentPostcodeFilterValues;
    }

    getCurrentProsecutorFilterValues(): string[] {
        return this.currentProsecutorFilterValues;
    }

    addFilteredCaseForPage(row: object): void {
        this.filteredCasesForPage.push(row);
    }

    getFilteredCasesForPage(): object[] {
        return this.filteredCasesForPage;
    }

    incrementCountOfFilteredCases(): void {
        this.countOfFilteredCases++;
    }

    setCountOfFilteredCases(filteredCasesCount: number): void {
        this.countOfFilteredCases = filteredCasesCount;
    }

    getCountOfFilteredCases(): number {
        return this.countOfFilteredCases;
    }

    isRowWithinPage() {
        const minPageLimit = (this.currentPage - 1) * 1000;
        const maxPageLimit = this.currentPage * 1000;

        return this.countOfFilteredCases > minPageLimit && this.countOfFilteredCases <= maxPageLimit;
    }

    generatePostcodeFilters() {
        const postcodeFilters: object[] = [];

        this.sortPostcodes().forEach(formattedPostcode => {
            const postcodeFiltered = this.currentFilterValues.includes(formattedPostcode);
            postcodeFilters.push({
                value: formattedPostcode,
                text: formattedPostcode,
                checked: postcodeFiltered,
            });

            if (postcodeFiltered) {
                this.currentPostcodeFilterValues.push(formattedPostcode);
            }
        });
        if (this.hasLondonPostcodeArea) {
            const londonPostcodeFiltered = this.currentFilterValues.includes(londonArea);
            postcodeFilters.push({
                value: londonArea,
                text: londonArea,
                checked: londonPostcodeFiltered,
            });

            if (londonPostcodeFiltered) {
                this.currentPostcodeFilterValues.push(londonArea);
            }
        }
        this.postcodeFilters = postcodeFilters;
    }

    getPostcodeFilters(): object {
        return this.postcodeFilters;
    }

    generateProsecutorFilters() {
        const prosecutorFilters: object[] = [];
        this.sortProsecutors().forEach(prosecutor => {
            const formattedProsecutor = prosecutor.replace(replaceRegex, '');
            const prosecutorFiltered = this.currentFilterValues.includes(formattedProsecutor);
            prosecutorFilters.push({
                value: formattedProsecutor,
                text: prosecutor,
                checked: prosecutorFiltered,
            });

            if (prosecutorFiltered) {
                this.currentProsecutorFilterValues.push(formattedProsecutor);
            }
        });
        this.prosecutorFilters = prosecutorFilters;
    }

    getProsecutorFilters(): object {
        return this.prosecutorFilters;
    }
}
