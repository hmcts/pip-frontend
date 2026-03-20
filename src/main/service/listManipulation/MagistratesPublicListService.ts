import { ListParseHelperService } from '../ListParseHelperService';
import { CrimeListsService } from './CrimeListsService';
// import { DateTime } from 'luxon';

const helperService = new ListParseHelperService();
const crimeListsService = new CrimeListsService();

export class MagistratesPublicListService {
    public manipulateData(jsonData: string): object {
        const listData = JSON.parse(jsonData);
        listData['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    session['formattedJudiciaries'] = helperService.findAndManipulateJudiciary(session);
                    session['sittings'].forEach(sitting => {
                        this.formatSittingStartTime(sitting);
                        sitting['hearing'].forEach(hearing => {
                            hearing['case']?.forEach(hearingCase => {
                                this.manipulateProsecutingAuthority(hearingCase);
                                const defendant = hearingCase.party?.find(party => party.partyRole === 'DEFENDANT');
                                this.manipulateDefendant(hearingCase, defendant);
                                this.findOffences(hearingCase, defendant);
                            });
                            hearing['application']?.forEach(hearingApplication => {
                                this.manipulateProsecutingAuthority(hearingApplication);
                                const defendant = hearingApplication.party?.find(party => party.subject === true);
                                this.manipulateDefendant(hearingApplication, defendant);
                                this.findOffences(hearingApplication, defendant);
                            });
                        });
                    });
                });
            });
        });
        return listData;
    }

    private manipulateProsecutingAuthority(node): void {
        const prosecutingAuthority = node.party?.find(party => party.partyRole === 'PROSECUTING_AUTHORITY');

        node.prosecutingAuthority =
            prosecutingAuthority?.organisationDetails?.organisationName ??
            (prosecutingAuthority?.individualDetails
                ? crimeListsService.createIndividualDetails(prosecutingAuthority.individualDetails)
                : '');
    }

    private manipulateDefendant(node, defendant): void {
        node.defendant = defendant?.organisationDetails?.organisationName ??
            (defendant?.individualDetails
                ? crimeListsService.createIndividualDetails(defendant.individualDetails)
                : '');
    }

    private findOffences(node, defendant): void {
        const offences = [];
        defendant?.offence?.forEach(offence => {
            offences.push(ListParseHelperService.writeStringIfValid(offence.offenceTitle));
        });
        node.offences = offences;
    }

    private formatSittingStartTime(node): void {
        if (!node.sittingStart) {
            node.time = '';
        } else {
            node.time = helperService.publicationTimeInUkTime(node.sittingStart);
        }
    }
}
