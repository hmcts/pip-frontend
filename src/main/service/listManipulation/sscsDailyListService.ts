import { DataManipulationService } from '../dataManipulationService';

const dataManipulationService = new DataManipulationService();
export class SscsDailyListService {
  /**
   * Manipulate the sscsDailyList json data for writing out on screen.
   * @param sscsDailyList
   */
  public manipulateSscsDailyListData(sscsDailyList: string): object {
    const sscsDailyListData = JSON.parse(sscsDailyList);
    let hearingCount = 0;

    sscsDailyListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['formattedJudiciary'] = dataManipulationService.getJudiciaryNameSurname(session);
          delete session['judiciary'];

          session['sittings'].forEach(sitting => {
            hearingCount = hearingCount + sitting['hearing'].length;
            sitting['sittingStartFormatted'] = dataManipulationService.publicationTimeInBst(sitting['sittingStart']);
            delete sitting['sittingStart'];
            dataManipulationService.findAndConcatenateHearingPlatform(sitting, session);
            delete sitting['channel'];
            delete session['sessionChannel'];
            sitting['hearing'].forEach(hearing => {
              dataManipulationService.findAndManipulatePartyInformation(hearing);

              hearing['informant'].forEach(informant => {
                let prosecutionAuthorityRefFormatted = '';
                informant['prosecutionAuthorityRef'].forEach(proscAuthRef => {
                  if (prosecutionAuthorityRefFormatted.length > 0) {
                    prosecutionAuthorityRefFormatted += ', ' + proscAuthRef;
                  } else {
                    prosecutionAuthorityRefFormatted += proscAuthRef;
                  }
                });
                hearing['prosecutionAuthorityRefFormatted'] = prosecutionAuthorityRefFormatted;
              });

              delete hearing['informant'];
              delete hearing['party'];
            });
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });
    return sscsDailyListData;
  }
}
