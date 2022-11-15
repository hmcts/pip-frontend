import moment from 'moment-timezone';
import { DataManipulationService } from '../dataManipulationService';
import { DateTimeHelper } from '../../helpers/dateTimeHelper';

const dataManipulationService = new DataManipulationService();
const dateTimeHelper = new DateTimeHelper();

/**
 * Service class provides reusable methods for crime list templates:
 *   Crown Daily List
 *   Magistrates Public List
 */
export class CrimeListsService {
  public manipulatedCrimeListData(dailyCauseList: string, language: string, languageFile: string): object {
    const crownDailyListData = JSON.parse(dailyCauseList);
    crownDailyListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['sittings'].forEach(sitting => {
            this.formatCaseTime(sitting, 'h:mma');
            sitting['formattedDuration'] = dateTimeHelper.formatDuration(
              sitting['durationAsDays'] as number,
              sitting['durationAsHours'] as number,
              sitting['durationAsMinutes'] as number,
              language,
              languageFile,
            );
            sitting['hearing'].forEach(hearing => {
              this.findAndManipulatePartyInformation(hearing);
              this.findLinkedCasesInformation(hearing);
            });
          });
        });
      });
    });

    return crownDailyListData;
  }

  private findAndManipulatePartyInformation(hearing: any): void {
    let prosecutingAuthority = '';
    let defendant = '';
    if (hearing?.party) {
      hearing.party.forEach(party => {
        switch (DataManipulationService.convertPartyRole(party.partyRole)) {
          case 'PROSECUTING_AUTHORITY': {
            prosecutingAuthority += this.createIndividualDetails(party.individualDetails).trim();
            prosecutingAuthority += dataManipulationService.stringDelimiter(prosecutingAuthority?.length, ',');
            break;
          }
          case 'DEFENDANT': {
            defendant += this.createIndividualDetails(party.individualDetails).trim();
            defendant += dataManipulationService.stringDelimiter(defendant?.length, ',');
            break;
          }
        }
      });
      hearing['prosecutingAuthority'] = prosecutingAuthority?.replace(/,\s*$/, '').trim();
      hearing['defendant'] = defendant?.replace(/,\s*$/, '').trim();
    }
  }

  /**
   * Format a set of individuals details.
   * @param individualDetails
   * @param initialised
   */
  private createIndividualDetails(individualDetails: any): string {
    const title = dataManipulationService.writeStringIfValid(individualDetails?.title);
    const forenames = dataManipulationService.writeStringIfValid(individualDetails?.individualForenames);
    const middleName = dataManipulationService.writeStringIfValid(individualDetails?.individualMiddleName);
    const surname = dataManipulationService.writeStringIfValid(individualDetails?.individualSurname);

    return (
      title +
      (title.length > 0 ? ' ' : '') +
      surname +
      (forenames.length > 0 || middleName.length > 0 ? ', ' : '') +
      forenames +
      (forenames.length > 0 ? ' ' : '') +
      middleName
    );
  }

  private formatCaseTime(sitting: object, format: string): void {
    if (sitting['sittingStart'] !== '') {
      sitting['time'] = moment.utc(sitting['sittingStart']).tz(dataManipulationService.timeZone).format(format);
    }
  }

  private findLinkedCasesInformation(hearing: any): void {
    let linkedCases = '';
    let listingNotes = '';

    if (hearing?.case) {
      hearing.case.forEach(cases => {
        linkedCases = '';
        if (cases?.caseLinked) {
          cases.caseLinked.forEach(caseLinked => {
            linkedCases += caseLinked.caseId.trim();
            linkedCases += dataManipulationService.stringDelimiter(linkedCases?.length, ',');
          });
        }
        cases['linkedCases'] = linkedCases?.replace(/,\s*$/, '').trim();
      });
    }

    if (hearing?.listingDetails) {
      listingNotes += hearing.listingDetails.listingRepDeadline.trim();
      listingNotes += dataManipulationService.stringDelimiter(listingNotes?.length, ',');
    }

    hearing['listingNotes'] = listingNotes?.replace(/,\s*$/, '').trim();
  }

  public findUnallocatedCasesInCrownDailyListData(dailyCauseList: string): Array<object> {
    const unallocatedCasesCrownListData = JSON.parse(dailyCauseList);
    const unallocatedCases = [];
    let courtListForUnallocatedCases;
    unallocatedCasesCrownListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        if (courtRoom.courtRoomName.includes('to be allocated')) {
          const courtRoomCopy = JSON.parse(JSON.stringify(courtRoom));
          unallocatedCases.push(courtRoomCopy);
          courtRoom['exclude'] = true;
        }
      });
      courtListForUnallocatedCases = JSON.parse(JSON.stringify(courtList));
    });

    if (unallocatedCases.length > 0) {
      this.formatUnallocatedCourtList(unallocatedCasesCrownListData, courtListForUnallocatedCases, unallocatedCases);
    }
    return unallocatedCasesCrownListData;
  }

  private formatUnallocatedCourtList(
    unallocatedCasesCrownListData: object,
    courtListForUnallocatedCases: object,
    unallocatedCase: any[],
  ): void {
    courtListForUnallocatedCases['courtHouse']['courtHouseName'] = '';
    courtListForUnallocatedCases['courtHouse']['courtHouseAddress'] = null;
    courtListForUnallocatedCases['unallocatedCases'] = true;
    courtListForUnallocatedCases['courtHouse']['courtRoom'] = unallocatedCase;
    unallocatedCasesCrownListData['courtLists'].push(courtListForUnallocatedCases);
  }
}
