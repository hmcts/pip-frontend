import { DateTime } from 'luxon';
import { ListParseHelperService } from '../listParseHelperService';
import { FilterService } from '../filterService';

const listParseHelperService = new ListParseHelperService();
const filterService = new FilterService();

export class SjpPressListService {
    /**
     * Manipulate the sjpPressList json data for writing out on screen.
     * @param sjpPressListJson
     */
    public formatSJPPressList(sjpPressListJson: string): any {
        const sjpPressListData = JSON.parse(sjpPressListJson);
        const rows = [];
        sjpPressListData['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    session['sittings'].forEach(sitting => {
                        sitting['hearing'].forEach(hearing => {
                            this.buildCases(hearing, rows);
                        });
                    });
                });
            });
        });
        return rows;
    }

    private buildCases(hearing, rows): any {
        if (hearing.party) {
            const party = hearing.party[0];
            const row = {
                name: listParseHelperService.createIndividualDetails(party.individualDetails),
                dob: this.formatDateOfBirth(party.individualDetails),
                age: party.individualDetails.age,
                caseUrn: hearing.case[0].caseUrn,
                address: this.buildAddress(party.individualDetails.address),
                postcode: party.individualDetails.address.postCode,
                organisationName: this.getOrganisationName(hearing),
                offences: this.buildOffences(hearing.offence),
            };
            rows.push(row);
        }
    }

    private formatDateOfBirth(individualDetails): string {
        return DateTime.fromISO(individualDetails.dateOfBirth.split('/').reverse().join('-')).toFormat('d MMMM yyyy');
    }

    private buildAddress(address): string {
        let formattedAddress = '';
        const lineCount = address.line ? address.line.length : 0;

        for (let i = 0; i < lineCount; i++) {
            if (address.line[i].length > 0) {
                formattedAddress += address.line[i];
            }

            if (i == lineCount - 1) {
                formattedAddress += ', ';
            } else {
                formattedAddress += ' ';
            }
        }

        if (address.town?.length > 0) {
            formattedAddress += address.town + ', ';
        }

        if (address.county?.length > 0) {
            formattedAddress += address.county + ', ';
        }

        formattedAddress += address.postCode;
        return formattedAddress;
    }

    private getOrganisationName(hearing): string {
        if (hearing.party.length > 1) {
            return hearing.party[1].organisationDetails.organisationName;
        }
        return '';
    }

    private buildOffences(offences): any {
        const rows = [];
        offences.forEach(offence => {
            const reportingRestriction = offence['reportingRestriction'].toString();
            const formattedReportingRestriction =
                reportingRestriction.charAt(0).toUpperCase() + reportingRestriction.slice(1);
            const row = {
                reportingRestrictionFlag: formattedReportingRestriction,
                offenceTitle: offence.offenceTitle,
                offenceWording: offence.offenceWording,
            };
            rows.push(row);
        });
        return rows;
    }

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

    private buildFilterOptions(data, filterValues): any {
        const postcodes = new Set<string>();
        const prosecutors = new Set<string>();

        data.forEach(item => {
            postcodes.add(item.postcode);
            prosecutors.add(item.organisationName);
        });

        const sortedPostcodes = Array.from(postcodes).sort(
          (a, b) => a.localeCompare(b, 'en', { numeric: true })
        );
        const sortedProsecutors = Array.from(prosecutors).sort();

        const filterStructure = {
            postcodes: [],
            prosecutors: [],
        };

        const replaceRegexComma = /,/g;
        const replaceRegexSpace = / /g;

        sortedPostcodes.forEach(postcode => {
            let formattedPostcode = postcode.replace(replaceRegexComma, '').replace(replaceRegexSpace, '');


            filterStructure.postcodes.push({
                value: formattedPostcode,
                text: postcode,
                checked: filterValues.includes(formattedPostcode),
            });
        });

        sortedProsecutors.forEach(prosecutor => {
            let formattedProsecutor = prosecutor.replace(replaceRegexComma, '').replace(replaceRegexSpace, '');

            filterStructure.prosecutors.push({
                value: formattedProsecutor,
                text: prosecutor,
                checked: filterValues.includes(formattedProsecutor),
            });
        });

        return filterStructure;
    }

    private filterCases(allCases, filterOptions) {
        const postcodeFilters = [];
        const prosecutorFilters = [];

        filterOptions.postcodes.forEach(item => {
            if (item.checked) {
                postcodeFilters.push(item.value);
            }
        });

        filterOptions.prosecutors.forEach(item => {
            if (item.checked) {
                prosecutorFilters.push(item.value);
            }
        });

        const filteredCases = [];

        const replaceRegexComma = /,/g;
        const replaceRegexSpace = / /g;

        allCases.forEach(item => {

            let formattedPostcode = item.postcode.replace(replaceRegexComma, '').replace(replaceRegexSpace, '');
            let formattedProsecutor = item.organisationName.replace(replaceRegexComma, '').replace(replaceRegexSpace, '');

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
