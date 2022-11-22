import { DataManipulationService } from '../dataManipulationService';
import { formatDate } from '../../helpers/dateTimeHelper';

export class IacDailyListService {

  dataManipulationService = new DataManipulationService();
  public manipulateIacDailyListData(iacDailyList: string): object {
    const iacDailyListData = JSON.parse(iacDailyList);
    let caseCount = 0;

    iacDailyListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['formattedJudiciary'] = this.getDeduplicatedJudiciaryNameSurname(session);
          session['sittings'].forEach(sitting => {
            sitting['sittingStartFormatted'] = formatDate(sitting['sittingStart'], 'h:mma');
            this.dataManipulationService.findAndConcatenateHearingPlatform(sitting, session);
            sitting['hearing'].forEach(hearing => {
              caseCount += hearing['case'].length;
              this.dataManipulationService.findAndManipulatePartyInformation(hearing);
              this.dataManipulationService.findAndManipulateLinkedCases(hearing);
            });
          });
          session['totalCases'] = caseCount;
          caseCount = 0;
        });
      });
    });
    return iacDailyListData;
  }

  private getDeduplicatedJudiciaryNameSurname(session: object): string {
    const judiciaries = [];
    session['judiciary']?.forEach(judiciary => {
      let currentJudiciary = '';
      if (DataManipulationService.writeStringIfValid(judiciary?.johTitle) !== '') {
        currentJudiciary = DataManipulationService.writeStringIfValid(judiciary?.johTitle);
      }

      if (DataManipulationService.writeStringIfValid(judiciary?.johNameSurname) !== '') {
        if (DataManipulationService.writeStringIfValid(judiciary?.johTitle) !== '') {
          currentJudiciary += ' ';
        }
        currentJudiciary += DataManipulationService.writeStringIfValid(judiciary?.johNameSurname);
      }

      if (!judiciaries.includes(currentJudiciary)) {
        judiciaries.push(currentJudiciary);
      }
    });
    return judiciaries.join(', ');
  }
}
