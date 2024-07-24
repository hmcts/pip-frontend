import { DateTime } from 'luxon';
import { ListParseHelperService } from '../ListParseHelperService';
import { SjpModel } from '../../models/style-guide/sjp-model';
import { SjpFilterService } from '../SjpFilterService';

const listParseHelperService = new ListParseHelperService();
const sjpFilterService = new SjpFilterService();

export class SjpPressListService {
    /**
     * Format the SJP Press list json data for writing out on screen.
     * @param sjpPressListJson The JSON data for the list
     * @param sjpModel The model to store the formatted data, and metadata while processing
     */
    public formatSJPPressList(sjpPressListJson: JSON, sjpModel: SjpModel): void {
        const rows = [];
        const hasFilterValues: boolean = sjpModel.getCurrentFilterValues().length > 0;

        sjpPressListJson['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    session['sittings'].forEach(sitting => {
                        sitting['hearing'].forEach(hearing => {
                            this.buildCases(hearing, sjpModel, rows, hasFilterValues);
                        });
                    });
                });
            });
        });

        // The filter list are generated and the filter values are split by types after all postcodes and prosecutors
        // have been added to the SJP model. This is required to be done first before filtering the SJP cases.
        sjpModel.generatePostcodeFilters();
        sjpModel.generateProsecutorFilters();
        if (hasFilterValues) {
            this.buildFilteredCases(rows, sjpModel);
        }
    }

    /**
     * Builds the cases for each of the hearings in the list.
     * @param hearing The hearing object in the data.
     * @param sjpModel The SJP model to update with the metadata.
     * @param rows The accumulative list of SJP cases.
     * @param hasFilterValues whether there are filter values associated with the request.
     * @private
     */
    private buildCases(hearing: any, sjpModel: SjpModel, rows: object[], hasFilterValues: boolean): void {
        if (hearing.party) {
            sjpModel.addTotalCaseNumber();

            const row = {
                ...this.processPartyRoles(hearing),
                caseUrn: hearing.case[0].caseUrn,
                offences: this.buildOffences(hearing.offence),
            };

            if (row.postcode) {
                sjpModel.addPostcode(row.postcode);
            }
            if (row.prosecutorName) {
                sjpModel.addProsecutor(row.prosecutorName);
            }
            rows.push(row);

            if (!hasFilterValues) {
                this.addFilteredCase(row, sjpModel);
            }
        }
    }

    private buildFilteredCases(rows, sjpModel) {
        rows.forEach(row => {
            if (
                sjpFilterService.filterSjpCase(
                    row,
                    sjpModel.getCurrentPostcodeFilterValues(),
                    sjpModel.getCurrentProsecutorFilterValues()
                )
            ) {
                this.addFilteredCase(row, sjpModel);
            }
        });
    }

    private addFilteredCase(row, sjpModel) {
        sjpModel.incrementCountOfFilteredCases();
        if (sjpModel.isRowWithinPage()) {
            sjpModel.addFilteredCaseForPage(row);
        }
    }

    private processPartyRoles(hearing: any): any {
        let prosecutorName = '';
        let accusedInfo = this.initialiseAccusedParty();

        hearing.party?.forEach(party => {
            if (party.partyRole === 'ACCUSED') {
                accusedInfo = this.processAccusedParty(party);
            } else if (party.partyRole === 'PROSECUTOR') {
                if (party.organisationDetails) {
                    prosecutorName = party.organisationDetails.organisationName;
                }
            }
        });

        return { ...accusedInfo, prosecutorName };
    }

    private processAccusedParty(party: any) {
        if (party.individualDetails) {
            return this.formatIndividualInformation(party.individualDetails);
        } else if (party.organisationDetails) {
            const organisation = party.organisationDetails;
            return {
                name: organisation.organisationName,
                dob: '',
                age: 0,
                address: organisation.organisationAddress ? this.buildAddress(organisation.organisationAddress) : '',
                postcode: organisation.organisationAddress ? organisation.organisationAddress.postCode : '',
            };
        }
    }

    private initialiseAccusedParty() {
        return { name: '', dob: '', age: 0, address: '', postcode: '' };
    }

    private formatIndividualInformation(individualDetails: any) {
        return {
            name: listParseHelperService.createIndividualDetails(individualDetails),
            dob: individualDetails.dateOfBirth ? this.formatDateOfBirth(individualDetails) : '',
            age: individualDetails.age ? individualDetails.age : 0,
            address: individualDetails.address ? this.buildAddress(individualDetails.address) : '',
            postcode: individualDetails.address?.postCode ? individualDetails.address?.postCode : '',
        };
    }

    private formatDateOfBirth(individualDetails: any): string {
        return DateTime.fromISO(individualDetails.dateOfBirth.split('/').reverse().join('-')).toFormat('d MMMM yyyy');
    }

    private buildAddress(address: any): string {
        const addressLines = [];
        if (address.line?.length > 0) {
            let formattedLines = '';
            for (let i = 0; i < address.line.length; i++) {
                if (address.line[i].length > 0) {
                    formattedLines += address.line[i];
                }
                if (i < address.line.length - 1) {
                    formattedLines += ' ';
                }
            }
            addressLines.push(formattedLines);
        }

        if (address.town?.length > 0) {
            addressLines.push(address.town);
        }

        if (address.county?.length > 0) {
            addressLines.push(address.county);
        }

        if (address.postCode?.length > 0) {
            addressLines.push(address.postCode);
        }
        return addressLines.join(', ');
    }

    private buildOffences(offences: any): any {
        const rows = [];
        offences.forEach(offence => {
            const reportingRestriction = offence['reportingRestriction'].toString();
            const formattedReportingRestriction =
                reportingRestriction.charAt(0).toUpperCase() + reportingRestriction.slice(1);
            const row = {
                reportingRestrictionFlag: formattedReportingRestriction,
                offenceTitle: offence.offenceTitle,
                offenceWording: ListParseHelperService.writeStringIfValid(offence.offenceWording).trim(),
            };
            rows.push(row);
        });
        return rows;
    }
}
