import { ListParseHelperService } from '../listParseHelperService';

const helperService = new ListParseHelperService();
export class civilFamilyAndMixedListService {

  /**
   * Manipulate the civil/family/mixed json data for rendering to the screen.
   * @param civilFamilyMixedList
   */
  public sculptedCivilFamilyMixedListData(civilFamilyMixedList: string): object {
    const outputData = JSON.parse(civilFamilyMixedList);
    let hearingCount = 0;
    outputData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['formattedJudiciaries'] = helperService.findAndManipulateJudiciary(session);
          session['sittings'].forEach(sitting => {
            helperService.calculateDuration(sitting);
            hearingCount = hearingCount + sitting['hearing'].length;
            helperService.findAndConcatenateHearingPlatform(sitting, session);

            sitting['hearing'].forEach(hearing => {
              helperService.findAndManipulatePartyInformation(hearing);
            });
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });

    return outputData;
  }
}
