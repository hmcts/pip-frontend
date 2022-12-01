import {DataManipulationService} from '../dataManipulationService';
import moment from 'moment';
import {formatDate} from '../../helpers/dateTimeHelper';
import {CrimeListsService} from './CrimeListsService';

const dataManipulationService = new DataManipulationService();
const crimeListsService = new CrimeListsService();

export class CrownWarnedListService {
  public manipulateData(warnedListData: string): Map<string, object[]> {
    const listData = new Map<string, object[]>;
    JSON.parse(warnedListData).courtLists.forEach(courtList => {
      courtList.courtHouse.courtRoom.forEach(courtRoom => {
        courtRoom.session.forEach(session => {
          session.sittings.forEach(sitting => {
            sitting.sittingStartFormatted = formatDate(sitting.sittingStart, 'DD/MM/YYYY');
            sitting.hearing.forEach(hearing => {
              crimeListsService.manipulateParty(hearing);
              dataManipulationService.findAndManipulateLinkedCases(hearing);
              const rows = [];

              hearing.case.forEach(hearingCase => {
                const row = {
                  caseReference: hearingCase.caseNumber,
                  defendant: hearing.defendant,
                  hearingDate: sitting.sittingStartFormatted,
                  defendantRepresentative: hearing.defendantRepresentative,
                  prosecutingAuthority: hearing.prosecutingAuthority,
                  linkedCases: hearingCase.formattedLinkedCases,
                  listingNotes: hearing.listNote,
                };
                rows.push(row);
              });

              const key = hearing.hearingType;
              if (listData.has(key)) {
                listData.set(key, listData.get(key).concat(rows));
              } else {
                listData.set(key, rows);
              }
            });
          });
        });
      });
    });

    return listData;
  }

  public formatContentDate(contentDate: string) {
    const date = new Date(contentDate);
    // Move the date to the past Monday if it is not on a Monday
    date.setDate(date.getDate() - (date.getDay() + 6) % 7);
    return moment.utc(Date.parse(date.toUTCString())).format('DD MMMM YYYY');
  }
}
