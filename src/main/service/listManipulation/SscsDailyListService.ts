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
            sitting['sittingStartFormatted'] = helperService.publicationTimeInUkTime(sitting['sittingStart']);
            delete sitting['sittingStart'];
            helperService.findAndConcatenateHearingPlatform(sitting, session);
            delete sitting['channel'];
            delete session['sessionChannel'];
            sitting['hearing'].forEach(hearing => {
              helperService.findAndManipulatePartyInformation(hearing);

              if (hearing?.informant) {
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
              }
              delete hearing['party'];
            });
          });
        });
      });
    });
    return sscsDailyListData;
  }
}
