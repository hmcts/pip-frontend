export class SjpModel {
    totalNumberOfCases: number = 0;
    currentPage: number = 1;
    postcodes = new Set<string>();
    prosecutors = new Set<string>();
    hasLondonPostcodeArea: boolean = false;
    replaceRegex = /[\s,]/g;
    londonArea = 'London Postcodes';
    londonPostalAreaCodes: string[] = ['N', 'NW', 'E', 'EC', 'SE', 'SW', 'W', 'WC'];
    currentFilterValues: string[] = [];
    filteredCases: object[] = [];
    countOfFilteredCases: number = 0;

    addTotalCaseNumber(): void {
        this.totalNumberOfCases++;
    }

    setCurrentPage(page: any | undefined): number {
        if (page && Number(page)) {
            this.currentPage = parseInt(page as string);
        }
        return this.currentPage;
    }

    addPostcode(postcode: string): void {
        this.postcodes.add(postcode.split(' ', 2)[0]);

        if (!this.hasLondonPostcodeArea && this.londonPostalAreaCodes.includes(postcode.split(/\d/)[0])) {
            this.hasLondonPostcodeArea = true;
        }
    }

    addProsecutor(prosecutor: string): void {
        this.prosecutors.add(prosecutor);
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

    addFilteredCase(row: object): void {
        this.filteredCases.push(row);
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
                value: this.londonArea,
                text: this.londonArea,
                checked: this.currentFilterValues.includes(this.londonArea),
            });
        }

        return postCodeFilters;
    }

    generateProsecutorFilters(): object[] {
        const prosecutorFilters: object[] = [];
        this.sortProsecutors().forEach(prosecutor => {
            const formattedProsecutor = prosecutor.replace(this.replaceRegex, '');

            prosecutorFilters.push({
                value: formattedProsecutor,
                text: prosecutor,
                checked: this.currentFilterValues.includes(formattedProsecutor),
            });
        });
        return prosecutorFilters;
    }
}
