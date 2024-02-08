import { ListParseHelperService } from '../listParseHelperService';
import { formatDate } from '../../helpers/dateTimeHelper';
import { OpaPressListService } from './OpaPressListService';

const opaPressListService = new OpaPressListService();

export class OpaPublicListService {
    public formatOpaPublicList(jsonData: string): any {
        const rows = [];

        JSON.parse(jsonData).courtLists.forEach(courtList => {
            courtList.courtHouse.courtRoom.forEach(courtRoom => {
                courtRoom.session.forEach(session => {
                    session.sittings.forEach(sitting => {
                        sitting.hearing.forEach(hearing => {
                            hearing.case.forEach(hearingCase => {
                                //if (hearingCase['party']) {
                                    const allDefendants = this.processPartyRoles(hearingCase);
                                    allDefendants.forEach(defendant => {
                                        const caseDetails = this.buildCaseDetails(hearingCase);
                                        rows.push({
                                            ...caseDetails,
                                            ...defendant,
                                        });
                                    });
                                //}
                            });
                        });
                    });
                });
            });
        });
        return rows;
    }

    private processPartyRoles(hearingCase): any {
        const defendants = [];
        hearingCase.party?.forEach(party => {
            if (party.partyRole === 'DEFENDANT') {
                const defendant = this.buildDefendantDetails(party);
                if (defendant) {
                    defendants.push(defendant);
                }
            }
        });
        const prosecutor = opaPressListService.processProsecutor(hearingCase);
        const allDefendants = [];
        defendants.forEach(defendant => {
            allDefendants.push({ ...defendant, prosecutor });
        });
        return allDefendants;
    }

    private buildDefendantDetails(party): any {
        if (party.individualDetails) {
            const individual = party.individualDetails;
            return {
                name: this.buildIndividualName(individual),
                offence: this.buildOffences(individual),
            };
        } else if (party.organisationDetails) {
            const organisation = party.organisationDetails;
            return {
                name: organisation.organisationName,
                offence: this.buildOffences(organisation),
            };
        }
        return null;
    }

    private buildIndividualName(individual) {
        const firstName = ListParseHelperService.writeStringIfValid(individual?.individualFirstName);
        const middleNames = ListParseHelperService.writeStringIfValid(individual?.individualMiddleName);
        const surname = ListParseHelperService.writeStringIfValid(individual?.individualSurname);
        return [firstName, middleNames, surname].filter(n => n.length > 0).join(' ');
    }

    private buildOffences(defendant) {
        const offences = [];
        defendant.offence?.forEach(offence => {
            offences.push(this.buildOffenceDetails(offence));
        });
        return offences;
    }

    private buildOffenceDetails(offence) {
        return {
            offenceTitle: ListParseHelperService.writeStringIfValid(offence.offenceTitle),
            offenceSection: ListParseHelperService.writeStringIfValid(offence.offenceSection),
            offenceReportingRestriction: offence.reportingRestrictionDetail?.filter(n => n.length > 0).join(', '),
        };
    }

    private buildCaseDetails(hearingCase): any {
        let scheduledHearingDate = '';
        const caseReportingRestriction = hearingCase.reportingRestrictionDetail?.filter(n => n.length > 0).join(', ');
        if (hearingCase.scheduledHearingDate.length > 0) {
            scheduledHearingDate = formatDate(
                ListParseHelperService.writeStringIfValid(hearingCase.scheduledHearingDate),
                'dd/MM/yy',
                'en'
            );
        }
        return {
            caseUrn: hearingCase.caseUrn,
            caseReportingRestriction,
            scheduledHearingDate: scheduledHearingDate,
        };
    }
}
