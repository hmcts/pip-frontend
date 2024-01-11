import { ListParseHelperService } from '../listParseHelperService';
import { formatDate } from '../../helpers/dateTimeHelper';
import { DateTime } from 'luxon';

const dateFormat = 'dd MMMM yyyy'

export class OpaResultsService {
    public manipulateData(jsonData: string, language: string): Map<string, object[]> {
        const listData = new Map<string, object[]>();

        JSON.parse(jsonData).courtLists.forEach(courtList => {
            courtList.courtHouse.courtRoom.forEach(courtRoom => {
                courtRoom.session.forEach(session => {
                    session.sittings.forEach(sitting => {
                        sitting.hearing.forEach(hearing => {
                            hearing.case.forEach(hearingCase => {
                                const caseUrn = ListParseHelperService.writeStringIfValid(hearingCase.caseUrn)
                                hearingCase.party?.forEach(party => {
                                    const partyInfo = this.processParty(party, language);
                                    if (partyInfo) {
                                        const row = {caseUrn, ...partyInfo};
                                        const key = partyInfo.offences[0].decisionDate;
                                        if (listData.has(key)) {
                                            listData.set(key, listData.get(key).concat(row));
                                        } else {
                                            listData.set(key, [row]);
                                        }
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });

        return new Map(
            [...listData].sort((a, b) =>
                this.convertDateToSortValue(b[0], language) - this.convertDateToSortValue(a[0], language))
        );
    }

    private convertDateToSortValue(date, language) {
        return DateTime.fromFormat(date, dateFormat, { locale : language }).toFormat('yyyyMMdd');
    }

    private processParty(party, language): any {
        if (party.partyRole === 'DEFENDANT') {
            const defendant = this.processDefendant(party);
            const offences = this.processOffences(party, language);

            if (defendant && offences.length > 0 && offences[0].decisionDate) {
                return {
                    defendant: defendant,
                    offences: offences,
                };
            }
        }
        return null;
    }

    private processDefendant(party): any {
        if (party.individualDetails) {
            const individualDetails = party.individualDetails;
            return this.formatDefendantName(individualDetails);
        } else if (party.organisationDetails) {
            return  party.organisationDetails.organisationName;
        }
        return null;
    }

    private formatDefendantName(individualDetails) {
        const forename = ListParseHelperService.writeStringIfValid(individualDetails.individualForenames);
        const middleName = ListParseHelperService.writeStringIfValid(individualDetails.individualMiddleName);
        const surname = ListParseHelperService.writeStringIfValid(individualDetails.individualSurname);

        const forenames = [forename, middleName].filter(n => n.length > 0).join(' ');
        return [surname, forenames].filter(n => n.length > 0).join(', ');
    }

    private processOffences(party, language) {
        const offences = [];
        party.offence?.forEach(offence => {
            offences.push(this.buildSingleOffence(offence, language));
        });
        return offences;
    }

    private buildSingleOffence(offence, language) {
        const decisionDate = formatDate(ListParseHelperService.writeStringIfValid(offence.decision?.decisionDate), dateFormat, language);
        const nextHearingDate = formatDate(ListParseHelperService.writeStringIfValid(offence.nextHearingDate), dateFormat, language);

        return {
            offenceTitle: ListParseHelperService.writeStringIfValid(offence.offenceTitle),
            offenceSection: ListParseHelperService.writeStringIfValid(offence.offenceSection),
            decisionDate: decisionDate,
            decisionDetail: ListParseHelperService.writeStringIfValid(offence.decision?.decisionDetail),
            bailStatus: ListParseHelperService.writeStringIfValid(offence.bailStatus),
            nextHearingDate: nextHearingDate,
            nextHearingLocation: ListParseHelperService.writeStringIfValid(offence.nextHearingLocation),
            reportingRestrictions: offence.reportingRestrictionDetail?.filter(n => n.length > 0).join(', '),
        };
    }
}
