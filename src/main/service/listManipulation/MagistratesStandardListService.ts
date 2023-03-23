import { ListParseHelperService } from '../listParseHelperService';
import { formatDate, formatDuration } from '../../helpers/dateTimeHelper';
import { CrimeListsService } from './CrimeListsService';

const helperService = new ListParseHelperService();
const crimeListsService = new CrimeListsService();

export class MagistratesStandardListService {
    public manipulatedMagsStandardListData(
        magsStandardListData: object,
        language: string,
        languageFile: string
    ): object {
        magsStandardListData['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    const allDefendants = [];
                    session['sittings'].forEach(sitting => {
                        const judiciary = helperService.findAndManipulateJudiciary(sitting);
                        if (judiciary !== '') {
                            session['formattedJudiciaries'] = judiciary;
                        }
                        helperService.formatCaseTime(sitting, 'h:mma');
                        sitting['formattedDuration'] = formatDuration(
                            sitting['durationAsDays'] as number,
                            sitting['durationAsHours'] as number,
                            sitting['durationAsMinutes'] as number,
                            language,
                            languageFile
                        );

                        allDefendants.push(...this.processHearing(sitting, language));
                    });
                    session['defendants'] = this.combineDefendantSittings(allDefendants);
                });
            });
        });

        return magsStandardListData;
    }

    private processHearing(sitting, language) {
        const allDefendants = [];
        sitting['hearing'].forEach(hearing => {
            hearing.party?.forEach(party => {
                const allOffences = [];
                const hearingString = JSON.stringify(hearing);
                const hearingObject = JSON.parse(hearingString);

                this.manipulateHearingObject(hearingObject, party, language);
                if (hearingObject['defendantHeading'] !== '') {
                    hearingObject['offence'].forEach(offence => {
                        allOffences.push(
                            this.formatOffence(
                                offence['offenceTitle'],
                                hearingObject['plea'],
                                'Need to confirm',
                                hearingObject['formattedConvictionDate'],
                                hearingObject['formattedAdjournedDate'],
                                offence['offenceWording']
                            )
                        );
                    });

                    allDefendants.push(
                        this.formatDefendant(
                            hearingObject['defendantHeading'],
                            hearingObject['gender'],
                            hearingObject['inCustody'],
                            sitting['time'],
                            sitting['formattedDuration'],
                            hearingObject['caseSequenceIndicator'],
                            hearingObject['defendantDateOfBirth'],
                            hearingObject['age'],
                            hearingObject['defendantAddress'],
                            hearingObject['prosecutionAuthorityCode'],
                            hearingObject['hearingNumber'],
                            sitting['caseHearingChannel'],
                            hearingObject['caseNumber'],
                            hearingObject['hearingType'],
                            hearingObject['panel'],
                            allOffences
                        )
                    );
                }
            });
        });

        return allDefendants;
    }

    private combineDefendantSittings(allDefendants): object {
        const defendantsPerSessions = [];
        const uniqueDefendantNames = helperService.uniquesInArrayByAttrib(allDefendants, 'defendantHeading');
        uniqueDefendantNames.forEach(defendantNames => {
            const defendant = allDefendants.filter(row => row.defendantHeading === defendantNames);
            defendantsPerSessions.push({
                defendantHeading: defendantNames,
                defendantInfo: defendant,
            });
        });
        return defendantsPerSessions;
    }

    private manipulateHearingObject(hearingObject, party, language) {
        this.manipulatePartyInformation(hearingObject, party);
        hearingObject['case'].forEach(thisCase => {
            hearingObject['formattedConvictionDate'] = formatDate(thisCase['convictionDate'], 'dd/MM/yyyy', language);
            hearingObject['formattedAdjournedDate'] = formatDate(thisCase['adjournedDate'], 'dd/MM/yyyy', language);
            hearingObject['caseSequenceIndicator'] = thisCase['caseSequenceIndicator'];
            hearingObject['hearingNumber'] = thisCase['hearingNumber'];
            hearingObject['prosecutionAuthorityCode'] = thisCase['informant']['prosecutionAuthorityCode'];
            hearingObject['caseNumber'] = thisCase['caseNumber'];
            hearingObject['panel'] = thisCase['panel'];
        });
    }

    private formatOffence(
        offenceTitle,
        plea,
        dateOfPlea,
        formattedConvictionDate,
        formattedAdjournedDate,
        offenceWording
    ) {
        return {
            offenceTitle: offenceTitle,
            plea: plea,
            dateOfPlea: dateOfPlea,
            formattedConvictionDate: formattedConvictionDate,
            formattedAdjournedDate: formattedAdjournedDate,
            offenceWording: offenceWording,
        };
    }

    private formatDefendant(
        defendantHeading,
        gender,
        inCustody,
        time,
        formattedDuration,
        caseSequenceIndicator,
        defendantDateOfBirth,
        age,
        defendantAddress,
        prosecutionAuthorityCode,
        hearingNumber,
        caseHearingChannel,
        caseNumber,
        hearingType,
        panel,
        allOffences
    ) {
        return {
            defendantHeading: this.formatDefendantHeading(defendantHeading, gender, inCustody),
            gender: gender,
            inCustody: inCustody,
            time: time,
            formattedDuration: formattedDuration,
            caseSequenceIndicator: caseSequenceIndicator,
            defendantDateOfBirth: defendantDateOfBirth,
            age: age,
            defendantAddress: defendantAddress,
            prosecutionAuthorityCode: prosecutionAuthorityCode,
            hearingNumber: hearingNumber,
            caseHearingChannel: caseHearingChannel,
            caseNumber: caseNumber,
            hearingType: hearingType,
            panel: panel,
            allOffences: allOffences,
        };
    }

    private formatDefendantHeading(name, gender, inCustody): string {
        let defendantHeading = name;
        if (gender?.length > 0) {
            defendantHeading += ' (' + gender + ')';
        }

        if (inCustody?.length > 0) {
            defendantHeading += inCustody;
        }
        return defendantHeading;
    }

    private manipulatePartyInformation(hearing: any, party: any): void {
        let defendant = '';

        if (ListParseHelperService.convertPartyRole(party.partyRole) === 'DEFENDANT') {
            defendant = crimeListsService.createIndividualDetails(party.individualDetails).trim();
        }

        hearing['defendantHeading'] = defendant?.replace(/,\s*$/, '').trim();
        hearing['defendantDateOfBirth'] = party?.individualDetails?.dateOfBirth;
        hearing['defendantAddress'] = this.formatDefendantAddress(party.individualDetails?.address);
        hearing['age'] = party?.individualDetails?.age;
        hearing['gender'] = party?.individualDetails?.gender;
        hearing['plea'] = party?.individualDetails?.plea;
        if (party?.individualDetails?.inCustody) {
            hearing['inCustody'] = party.individualDetails?.inCustody === true ? '*' : '';
        }
    }

    private formatDefendantAddress(defendantAddress: object): string {
        let formattedAddress = '';
        if (defendantAddress !== null) {
            defendantAddress['line'].forEach(line => {
                formattedAddress += formattedAddress.length > 0 ? ', ' + line : line;
            });
            formattedAddress += defendantAddress['town'] ? ', ' + defendantAddress['town'] : '';
            formattedAddress += defendantAddress['county'] ? ', ' + defendantAddress['county'] : '';
            formattedAddress += defendantAddress['postCode'] ? ', ' + defendantAddress['postCode'] : '';
        }

        return formattedAddress.replace(/,\s*$/, '').trim();
    }
}
