import { ListParseHelperService } from '../listParseHelperService';

const helperService = new ListParseHelperService();

export class CopDailyListService {

  /**
   * Manipulate the copDailyCauseList json data for writing out on screen.
   * @param copDailyCauseList The cop daily cause list to manipulate
   */
  public manipulateCopDailyCauseList(copDailyCauseList: string): object {
    const copDailyCauseListData = JSON.parse(copDailyCauseList);
    let hearingCount = 0;

    copDailyCauseListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['formattedJudiciary'] = helperService.getJudiciaryNameSurname(session);
          delete session['judiciary'];
          session['sittings'].forEach(sitting => {
            hearingCount = hearingCount + sitting['hearing'].length;
            sitting['sittingStartFormatted'] = helperService.publicationTimeInUkTime(sitting['sittingStart']);
            helperService.calculateDuration(sitting);
            helperService.findAndConcatenateHearingPlatform(sitting, session);
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });
    return copDailyCauseListData;
  }
}
