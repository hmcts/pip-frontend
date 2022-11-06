import moment from 'moment-timezone';
import {DataManipulationService} from '../dataManipulationService';
import {DateTimeHelper} from '../../helpers/dateTimeHelper';

const dataManipulationService = new DataManipulationService();
const dateTimeHelper = new DateTimeHelper();

export class CrownFirmListService {
  public timeZone = 'Europe/London';

  public splitOutFirmListData(firmList: string, language: string, languageFile: string) {
    const rows = [];
    const firmListData = JSON.parse(firmList);
    firmListData['courtLists'].forEach(courtList => {
      const courtName = courtList['courtHouse']['courtHouseName'];
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['sittings'].forEach(sitting => {
            const sittingDate = moment.utc(sitting['sittingStart']).tz(this.timeZone).format('dddd DD MMMM YYYY');
            sitting['formattedDuration'] = dateTimeHelper.formatDuration(sitting['durationAsDays'] as number, sitting['durationAsHours'] as number,
              sitting['durationAsMinutes'] as number, language, languageFile);
            sitting['hearing'].forEach(hearing => {
              hearing['case'].forEach(thisCase => {
                const row = {
                  courtName: courtName,
                  sittingDate: sittingDate,
                  sittingTime: dataManipulationService.publicationTimeInBst(sitting['sittingStart']),
                  courtRoom: courtRoom['courtRoomName'],
                  durationAsHours: sitting['durationAsHours'],
                  durationAsMinutes: sitting['durationAsMinutes'],
                  caseNumber: thisCase['caseNumber'],
                  caseSeparator: thisCase['caseSequenceIndicator'],
                  defendant: hearing['defendant'],
                  defendantRepresentative: hearing['defendantRepresentative'],
                  prosecutingAuthority: hearing['prosecutingAuthority'],
                  linkedCases: thisCase[0],
                  // hearingType: hearing['hearingType'],
                  jurisdiction: thisCase['caseType'],
                  hearingPlatform: sitting['caseHearingChannel'],
                };
                console.log(row);
                rows.push(row);
              });
            });
          });
        });
      });
    });
    return this.splitByCourtAndDateAndAllocation(rows);
  }

  private splitByCourtAndDateAndAllocation(data: any) {
    const courts = [];
    const unallocated = data.filter(row => row.courtRoom.toLowerCase().includes('to be allocated'));
    const allocated = data.filter(row => !unallocated.includes(row));
    console.log(allocated.length);
    console.log(unallocated.length);
    data.filter(row => row.courtRoom.toLowerCase().includes('to be allocated')).forEach(row => row.courtName = 'unallocated');
    const uniqueCourts = dataManipulationService.uniquesInArrayByAttrib(data, 'courtName');
    let courtCounter = 0;
    uniqueCourts.forEach(court => {
      const courtData = data.filter(row => row.courtName === court);
      courts.push({'courtName': court, days: []});
      const uniqueDays = dataManipulationService.uniquesInArrayByAttrib(courtData, 'sittingDate');
      const uniqueDaysArr = [];
      Array.from(uniqueDays).forEach(day => {
        const encDay = moment.utc(day, 'dddd DD MMMM YYYY').tz(this.timeZone);
        uniqueDaysArr.push(encDay);
      });
      uniqueDaysArr.sort(function(a, b) {
        return a - b;
      });
      uniqueDaysArr.forEach(day => {
        const formattedDay = moment.utc(day).tz(this.timeZone).format('dddd DD MMMM YYYY');
        const record = courtData.filter(row => row.sittingDate === formattedDay);
        courts[courtCounter]['days'].push(record);
      });
      courtCounter += 1;
    });
    return courts;
  }

}
