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
                                this.manipulateDefendant(hearingCase);
                                this.findOffences(hearingCase);
                            });
                            hearing['application']?.forEach(hearingApplication => {
                                this.manipulateProsecutingAuthority(hearingApplication);
                                this.manipulateDefendant(hearingApplication);
                                this.findOffences(hearingApplication);
                            });
                        });
                    });
                });
            });
        });
        return listData;
    }

    public manipulateProsecutingAuthority(node): void {
        const prosecutingAuthority = node.party?.find(party => party.partyRole === 'PROSECUTING_AUTHORITY');

        node.prosecutingAuthority =
            prosecutingAuthority?.organisationDetails?.organisationName ??
            (prosecutingAuthority?.individualDetails
                ? crimeListsService.createIndividualDetails(prosecutingAuthority.individualDetails)
                : '');
    }

    public manipulateDefendant(node): void {
        const defendant = node.party?.find(party => party.subject === true);

        node.defendant =
            defendant?.organisationDetails?.organisationName ??
            (defendant?.individualDetails
                ? crimeListsService.createIndividualDetails(defendant.individualDetails)
                : '');
    }

    public findOffences(node): void {
        const defendant = node.party?.find(party => party.subject === true);
        const offences = [];

        defendant?.offence?.forEach(offence => {
            offences.push(ListParseHelperService.writeStringIfValid(offence.offenceTitle));
        });
        node.offences = offences;
    }

    public formatSittingStartTime(node): void {
        if (!node.sittingStart) {
            node.time = '';
        } else {
            node.time = helperService.publicationTimeInUkTime(node.sittingStart);
        }
    }
}
