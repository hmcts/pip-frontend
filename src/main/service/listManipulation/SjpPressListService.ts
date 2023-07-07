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
        let organisationName = '';
        let individualInfo = this.initialiseIndividualInformation();

        hearing.party?.forEach(party => {
            if (party.partyRole === 'ACCUSED') {
                if (party.individualDetails) {
                    individualInfo = this.formatIndividualInformation(party.individualDetails);
                }
            } else if (party.partyRole === 'PROSECUTOR') {
                if (party.organisationDetails) {
                    organisationName = party.organisationDetails.organisationName;
                }
            }
        });

        return { ...individualInfo, organisationName };
    }

    private initialiseIndividualInformation() {
        return { name: '', dob: '', age: '', address: '', postcode: '' };
    }

    private formatIndividualInformation(individualDetails) {
        return {
            name: listParseHelperService.createIndividualDetails(individualDetails),
            dob: this.formatDateOfBirth(individualDetails),
            age: individualDetails.age,
            address: this.buildAddress(individualDetails.address),
            postcode: individualDetails.address.postCode,
        };
    }

    private formatDateOfBirth(individualDetails): string {
        return DateTime.fromISO(individualDetails.dateOfBirth.split('/').reverse().join('-'))
            .toFormat('d MMMM yyyy');
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
