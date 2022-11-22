import { DataManipulationService } from '../dataManipulationService';

export class IacDailyListService {

  dataManipulationService = new DataManipulationService();
  public manipulateIacDailyListData(iacDailyList: string): object {
    const iacDailyListData = JSON.parse(iacDailyList);
    let caseCount = 0;

    iacDailyListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['formattedJudiciary'] = this.dataManipulationService.getDeduplicatedJudiciaryNameSurname(courtRoom);
        courtRoom['session'].forEach(session => {
          session['sittings'].forEach(sitting => {
            sitting['sittingStartFormatted'] = this.dataManipulationService.publicationTimeInBst(sitting['sittingStart']);
            this.dataManipulationService.findAndConcatenateHearingPlatform(sitting, session);
            sitting['hearing'].forEach(hearing => {
              caseCount += hearing['case'].length;
              this.dataManipulationService.findAndManipulatePartyInformation(hearing);
              this.dataManipulationService.findAndManipulateLinkedCases(hearing);
            });
          });
        });
        courtRoom['totalCases'] = caseCount;
        caseCount = 0;
      });
    });
    return iacDailyListData;
  }
}
