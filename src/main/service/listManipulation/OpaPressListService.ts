import { ListParseHelperService } from '../listParseHelperService';
import { CrimeListsService } from './CrimeListsService';
import { formatDate } from '../../helpers/dateTimeHelper';

const crimeListService = new CrimeListsService();

export class OpaPressListService {
    public manipulateData(jsonData: string): Map<string, object[]> {
        const listData = new Map<string, object[]>();

        JSON.parse(jsonData).courtLists.forEach(courtList => {
            courtList.courtHouse.courtRoom.forEach(courtRoom => {
                courtRoom.session.forEach(session => {
                    session.sittings.forEach(sitting => {
                        sitting.hearing.forEach(hearing => {
                            const defendantInfo = this.processPartyRoles(hearing);

                            // Each case can have multiple defendants. They will be shown as separate entry on the list
                            // as each can have its own plea date
                            defendantInfo.forEach(defendant => {
                                const rows = [];
                                hearing.case.forEach(hearingCase => {
                                    const caseInfo = this.buildHearingCase(hearingCase);
                                    const row = { ...caseInfo, ...defendant };
                                    rows.push(row);
                                });

                                // All the offences under the same defendant have the same plea date
                                const key = defendant.offence[0].pleaDate;
                                if (listData.has(key)) {
                                    listData.set(key, listData.get(key).concat(rows));
                                } else {
                                    listData.set(key, rows);
                                }
                            });
                        });
                    });
                });
            });
        });

        return new Map(
            [...listData].sort((a, b) => this.convertDateToSortValue(b[0]) - this.convertDateToSortValue(a[0]))
        );
    }

    private convertDateToSortValue(date) {
        return date.split('/').reverse().join('');
    }

    private buildHearingCase(hearingCase): any {
        const scheduledHearingDate = formatDate(
            ListParseHelperService.writeStringIfValid(hearingCase.scheduledHearingDate),
            'dd/MM/yyyy',
            'en'
        );
        return {
            urn: hearingCase.caseUrn,
            scheduledHearingDate: scheduledHearingDate,
            caseReportingRestriction: this.formatReportingRestriction(hearingCase),
        };
    }

    private formatReportingRestriction(field): string {
        return field.reportingRestrictionDetail?.filter(n => n.length > 0).join(', ');
    }

    private processPartyRoles(hearing): any {
        const defendants = [];
        hearing.party?.forEach(party => {
            if (party.partyRole === 'DEFENDANT') {
                const defendant = this.processDefendant(party);
                if (defendant) {
                    defendants.push(defendant);
                }
            }
        });
        const prosecutor = this.processProsecutor(hearing);

        const defendantInfo = [];
        defendants.forEach(defendant => {
            // The offence's plea date is used to group and sort the cases for the defendant. If plea date is missing,
            // the entry will be dropped
            if (defendant && defendant.name && defendant.offence.length > 0 && defendant.offence[0].pleaDate) {
                defendantInfo.push({ ...defendant, prosecutor });
            }
        });
        return defendantInfo;
    }

    private processDefendant(party): any {
        if (party.individualDetails) {
            const individualDetails = party.individualDetails;
            return {
                name: this.formatDefendantName(individualDetails),
                dob: ListParseHelperService.writeStringIfValid(individualDetails.dateOfBirth),
                age: ListParseHelperService.writeStringIfValid(individualDetails.age),
                address: crimeListService.formatAddress(individualDetails.address, ', '),
                offence: this.processOffence(individualDetails),
            };
        } else if (party.organisationDetails) {
            const organisationDetails = party.organisationDetails;
            return {
                name: organisationDetails.organisationName,
                dob: '',
                age: '',
                address: crimeListService.formatAddress(organisationDetails.organisationAddress, ', '),
                offence: this.processOffence(organisationDetails),
            };
        }
        return null;
    }

    private formatDefendantName(individualDetails) {
        const forename = ListParseHelperService.writeStringIfValid(individualDetails?.individualForenames);
        const middleName = ListParseHelperService.writeStringIfValid(individualDetails?.individualMiddleName);
        const surname = ListParseHelperService.writeStringIfValid(individualDetails?.individualSurname);

        const forenames = [forename, middleName].filter(n => n.length > 0).join(' ');
        return [surname, forenames].filter(n => n.length > 0).join(', ');
    }

    private processProsecutor(hearing): string {
        const prosecutor = this.getPartyInformant(hearing);
        if (prosecutor.length === 0) {
            return this.getPartyProsecutor(hearing);
        }
        return prosecutor;
    }

    private getPartyInformant(hearing): string {
        const informants = [];
        hearing.case.forEach(hearingCase => {
            informants.push(ListParseHelperService.writeStringIfValid(hearingCase.informant?.prosecutionAuthorityRef));
        });
        return [...new Set(informants)].filter(n => n.length > 0).join(', ');
    }

    private getPartyProsecutor(hearing): string {
        const prosecutors = [];
        hearing.party?.forEach(party => {
            if (party.partyRole === 'PROSECUTING_AUTHORITY' && party.organisationDetails?.organisationName) {
                prosecutors.push(party.organisationDetails.organisationName);
            }
        });
        return prosecutors.join(', ');
    }

    private processOffence(details) {
        const offences = [];
        details.offence?.forEach(offence => {
            offences.push(this.formatOffenceDetails(offence));
        });
        return offences;
    }

    private formatOffenceDetails(offence) {
        const pleaDate = formatDate(ListParseHelperService.writeStringIfValid(offence.pleaDate), 'dd/MM/yyyy', 'en');

        return {
            offenceTitle: ListParseHelperService.writeStringIfValid(offence.offenceTitle),
            offenceSection: ListParseHelperService.writeStringIfValid(offence.offenceSection),
            offenceWording: ListParseHelperService.writeStringIfValid(offence.offenceWording),
            plea: ListParseHelperService.writeStringIfValid(offence.plea),
            pleaDate: pleaDate,
            offenceReportingRestriction: this.formatReportingRestriction(offence),
        };
    }
}
