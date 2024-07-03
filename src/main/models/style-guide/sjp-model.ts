import { londonPostalAreaCodes, londonArea, replaceRegex } from '../../service/SjpFilterService';

export class SjpModel {
    private totalNumberOfCases: number = 0;
    private currentPage: number = 1;
    private postcodes = new Set<string>();
    private prosecutors = new Set<string>();
    private hasLondonPostcodeArea: boolean = false;
    private currentFilterValues: string[] = [];
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

    generatePostcodeFilters(): object[] {
        const postCodeFilters: object[] = [];
        this.sortPostcodes().forEach(formattedPostcode => {
            postCodeFilters.push({
                value: formattedPostcode,
                text: formattedPostcode,
                checked: this.currentFilterValues.includes(formattedPostcode),
            });
        });

        if (this.hasLondonPostcodeArea) {
            postCodeFilters.push({
                value: londonArea,
                text: londonArea,
                checked: this.currentFilterValues.includes(londonArea),
            });
        }

        return postCodeFilters;
    }

    generateProsecutorFilters(): object[] {
        const prosecutorFilters: object[] = [];
        this.sortProsecutors().forEach(prosecutor => {
            const formattedProsecutor = prosecutor.replace(replaceRegex, '');

            prosecutorFilters.push({
                value: formattedProsecutor,
                text: prosecutor,
                checked: this.currentFilterValues.includes(formattedProsecutor),
            });
        });
        return prosecutorFilters;
    }
}
