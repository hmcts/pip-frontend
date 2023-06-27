import { ListParseHelperService } from '../listParseHelperService';

const helperService = new ListParseHelperService();
export class SscsDailyListService {
    /**
     * Manipulate the sscsDailyList json data for writing out on screen.
     * @param sscsDailyList
     */
    public manipulateSscsDailyListData(sscsDailyList: string): object {
        const sscsDailyListData = JSON.parse(sscsDailyList);

        sscsDailyListData['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    session['formattedJudiciary'] = helperService.getJudiciaryNameSurname(session);
                    delete session['judiciary'];

                    session['sittings'].forEach(sitting => {
                        sitting['sittingStartFormatted'] = helperService.publicationTimeInUkTime(
                            sitting['sittingStart']
                        );
                        delete sitting['sittingStart'];
                        helperService.findAndConcatenateHearingPlatform(sitting, session);
                        delete sitting['channel'];
                        delete session['sessionChannel'];
                        sitting['hearing'].forEach(hearing => {
                            helperService.findAndManipulatePartyInformation(hearing);
                            hearing['formattedRespondent'] = this.formatRespondent(hearing);
                        });
                    });
                });
            });
        });
        return sscsDailyListData;
    }

    private formatRespondent(hearing): string {
        const informant = this.getInformant(hearing);
        if (informant.length === 0) {
            return this.getPartyProsecutor(hearing);
        }
        return informant;
    }

    private getInformant(hearing): string {
        const informants = [];
        hearing.informant?.forEach(informant => {
            informant.prosecutionAuthorityRef?.forEach(proscAuthRef => {
                if (proscAuthRef.length > 0) {
                    informants.push(proscAuthRef);
                }
            });
        });
        return informants.join(', ');
    }

    private getPartyProsecutor(hearing): string {
        const prosecutors = [];
        hearing.party?.forEach(party => {
            if (party.partyRole === 'PROSECUTOR') {
                const prosecutor = party.organisationDetails?.organisationName;
                if (prosecutor && prosecutor.length > 0) {
                    prosecutors.push(prosecutor);
                }
            }
        });
        return prosecutors.join(', ');
    }
}
