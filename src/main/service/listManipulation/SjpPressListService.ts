import { DateTime } from 'luxon';
import { ListParseHelperService } from '../listParseHelperService';

const listParseHelperService = new ListParseHelperService();

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
            const row = {
                ...this.processPartyRoles(hearing),
                caseUrn: hearing.case[0].caseUrn,
                offences: this.buildOffences(hearing.offence),
            };
            rows.push(row);
        }
    }

    private processPartyRoles(hearing): any {
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

    private processAccusedParty(party) {
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

    private formatIndividualInformation(individualDetails) {
        return {
            name: listParseHelperService.createIndividualDetails(individualDetails),
            dob: this.formatDateOfBirth(individualDetails),
            age: individualDetails.age,
            address: individualDetails.address ? this.buildAddress(individualDetails.address) : '',
            postcode: individualDetails.address?.postCode ? individualDetails.address?.postCode : '',
        };
    }

    private formatDateOfBirth(individualDetails): string {
        return DateTime.fromISO(individualDetails.dateOfBirth.split('/').reverse().join('-')).toFormat('d MMMM yyyy');
    }

    private buildAddress(address): string {
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
}
