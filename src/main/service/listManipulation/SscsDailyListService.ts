import { ListParseHelperService } from '../ListParseHelperService';

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
                    session['formattedJudiciary'] = helperService.findAndManipulateJudiciary(session);
                    delete session['judiciary'];

                    session['sittings'].forEach(sitting => {
                        sitting['sittingStartFormatted'] = helperService.publicationTimeInUkTime(
                            sitting['sittingStart']
                        );
                        delete sitting['sittingStart'];
                        helperService.findAndConcatenateHearingPlatform(sitting, session);
                        delete sitting['channel'];
                        sitting['hearing'].forEach(hearing => {
                            hearing['case'].forEach(hearingCase => {
                                helperService.findAndManipulatePartyInformation(hearingCase);
                                hearingCase['formattedRespondent'] = this.getPartyRespondent(hearingCase);
                            });
                        });
                    });
                    delete session['sessionChannel'];
                });
            });
        });
        return sscsDailyListData;
    }

    private getPartyRespondent(hearingCase): string {
        const respondents = [];
        hearingCase.party?.forEach(party => {
            if (party.partyRole === 'RESPONDENT') {
                const respondent = party.organisationDetails?.organisationName;
                if (respondent && respondent.length > 0) {
                    respondents.push(respondent);
                }
            }
        });
        return respondents.join(', ');
    }
}
