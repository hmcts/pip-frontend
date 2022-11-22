import { DataManipulationService } from '../dataManipulationService';

const dataManipulationService = new DataManipulationService();

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
          session['formattedJudiciary'] = dataManipulationService.getJudiciaryNameSurname(session);
          delete session['judiciary'];
          session['sittings'].forEach(sitting => {
            hearingCount = hearingCount + sitting['hearing'].length;
            sitting['sittingStartFormatted'] = dataManipulationService.publicationTimeInBst(sitting['sittingStart']);
            dataManipulationService.calculateDuration(sitting);
            dataManipulationService.findAndConcatenateHearingPlatform(sitting, session);
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });
    return copDailyCauseListData;
  }
}
