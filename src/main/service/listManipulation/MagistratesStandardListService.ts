import { ListParseHelperService } from '../ListParseHelperService';
import { CrimeListsService } from './CrimeListsService';
import { formatDate } from '../../helpers/dateTimeHelper';

const helperService = new ListParseHelperService();
const crimeListsService = new CrimeListsService();
const needToConfirm = 'Need to confirm';

export class MagistratesStandardListService {
    public manipulateData(jsonData: string, language: string): Map<string, object[]> {
        const listData = new Map<string, object[]>();

        JSON.parse(jsonData).courtLists.forEach(courtList => {
            courtList.courtHouse.courtRoom.forEach(courtRoom => {
                courtRoom.session.forEach(session => {
                    session.sittings.forEach(sitting => {
                        this.processSittingInfo(session, sitting, language);
                        const cases = [];
                        sitting.hearing.forEach(hearing => {
                            hearing.case.forEach(hearingCase => {
                                if (hearingCase.party) {
                                    const caseInfo = this.buildHearingCase(hearingCase, sitting, hearing);
                                    const caseSitting = this.buildCaseSitting(sitting, caseInfo);
                                    hearingCase.party?.forEach(party => this.processParty(party, caseSitting, cases));
                                }
                            });
                        });
                        const key = this.formatCourtRoomJudiciary(courtRoom, session, sitting);
                        if (listData.has(key)) {
                            listData.set(key, listData.get(key).concat(cases));
                        } else {
                            listData.set(key, cases);
                        }
                    });
                });
            });
        });

        return listData;
    }

    private processSittingInfo(session, sitting, language) {
        crimeListsService.calculateDuration(sitting, language, 'style-guide/magistrates-standard-list');
        helperService.findAndConcatenateHearingPlatform(sitting, session);
    }

    private buildHearingCase(hearingCase, sitting, hearing) {
        return {
            prosecutingAuthorityCode: ListParseHelperService.writeStringIfValid(
                hearingCase.informant?.prosecutionAuthorityCode
            ),
            hearingNumber: ListParseHelperService.writeStringIfValid(hearingCase.hearingNumber),
            attendanceMethod: ListParseHelperService.writeStringIfValid(sitting.caseHearingChannel),
            caseNumber: ListParseHelperService.writeStringIfValid(hearingCase.caseNumber),
            caseSequenceIndicator: ListParseHelperService.writeStringIfValid(hearingCase.caseSequenceIndicator),
            asn: needToConfirm,
            hearingType: ListParseHelperService.writeStringIfValid(hearing.hearingType),
            panel: ListParseHelperService.writeStringIfValid(hearingCase.panel),
            convictionDate: this.formatDate(hearingCase.convictionDate),
            adjournedDate: this.formatDate(hearingCase.adjournedDate),
        };
    }

    private formatDate(date) {
        return formatDate(ListParseHelperService.writeStringIfValid(date), 'dd/MM/yyyy', 'en');
    }

    private buildCaseSitting(sitting, caseInfo) {
        return {
            sittingStartTime: ListParseHelperService.writeStringIfValid(sitting.time),
            sittingDuration: ListParseHelperService.writeStringIfValid(sitting.formattedDuration),
            caseInfo: caseInfo,
        };
    }

    private processParty(party, caseSitting, cases) {
        if (party.partyRole === 'DEFENDANT' && party.individualDetails) {
            const defendantHeading = this.formatDefendantHeading(party.individualDetails);
            caseSitting = {
                ...caseSitting,
                defendantInfo: this.buildDefendantInfo(party),
                offences: this.processOffences(party),
            };
            this.addDefendantCase(cases, defendantHeading, caseSitting);
        }
    }

    private buildDefendantInfo(party) {
        return {
            dob: ListParseHelperService.writeStringIfValid(party.individualDetails.dateOfBirth),
            age: ListParseHelperService.writeStringIfValid(party.individualDetails.age),
            address: crimeListsService.formatAddress(party.individualDetails.address, ', '),
            plea: ListParseHelperService.writeStringIfValid(party.individualDetails.plea),
            pleaDate: needToConfirm,
        };
    }

    private formatDefendantHeading(individualDetails) {
        const gender = ListParseHelperService.writeStringIfValid(individualDetails.gender);
        return (
            crimeListsService.createIndividualDetails(individualDetails) +
            (gender.length > 0 ? ` (${gender})` : '') +
            (individualDetails.inCustody ? '*' : '')
        );
    }

    private processOffences(party) {
        const offences = [];
        party.offence?.forEach(offence => {
            offences.push({
                offenceTitle: ListParseHelperService.writeStringIfValid(offence.offenceTitle),
                offenceWording: ListParseHelperService.writeStringIfValid(offence.offenceWording),
            });
        });
        return offences;
    }

    private addDefendantCase(cases, defendantHeading, caseSitting) {
        // Check if a case with the same defendant heading has already been stored. If so append the new case to it,
        // or else create a new case and add to the list of cases
        const commonCase = this.fetchCommonDefendantCase(cases, defendantHeading);

        if (commonCase) {
            commonCase.caseSittings.push(caseSitting);
        } else {
            const caseSittings = [caseSitting];
            cases.push({ defendantHeading, caseSittings });
        }
    }

    private fetchCommonDefendantCase(cases, defendantHeading) {
        for (const c of cases) {
            if (c.defendantHeading === defendantHeading) {
                return c;
            }
        }
        return null;
    }

    private formatCourtRoomJudiciary(courtRoom, session, sitting) {
        let judiciary = helperService.findAndManipulateJudiciaryForCrime(sitting);
        if (!judiciary) {
            judiciary = helperService.findAndManipulateJudiciaryForCrime(session);
        }
        const courtRoomName = ListParseHelperService.writeStringIfValid(courtRoom.courtRoomName);
        return [courtRoomName, judiciary].filter(item => item.length > 0).join(': ');
    }
}
