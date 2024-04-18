import { ListParseHelperService } from '../listParseHelperService';

const helperService = new ListParseHelperService();

export class CopDailyListService {
    /**
     * Manipulate the copDailyCauseList json data for writing out on screen.
     * @param copDailyCauseList The cop daily cause list to manipulate
     */
    public manipulateCopDailyCauseList(copDailyCauseList: string): object {
        const copDailyCauseListData = JSON.parse(copDailyCauseList);

        copDailyCauseListData['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    session['formattedJudiciary'] = helperService.findAndManipulateJudiciary(session);
                    delete session['judiciary'];
                    session['sittings'].forEach(sitting => {
                        helperService.calculateDuration(sitting);
                        helperService.findAndConcatenateHearingPlatform(sitting, session);
                    });
                });
            });
        });
        return copDailyCauseListData;
    }
}
