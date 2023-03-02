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
}
