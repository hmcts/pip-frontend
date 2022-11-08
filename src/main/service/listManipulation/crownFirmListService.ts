import moment from 'moment-timezone';
import {DataManipulationService} from '../dataManipulationService';
import {DateTimeHelper} from '../../helpers/dateTimeHelper';
import {CrownDailyListService} from './crownDailyListService';

const dataManipulationService = new DataManipulationService();
const dailyListService = new CrownDailyListService();
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
              dailyListService.findLinkedCasesInformation(hearing);
              hearing['case'].forEach(thisCase => {
                const formattedName = hearing['defendant'].split(/\s+/);
                const row = {
                  courtName: courtName,
                  sittingDate: sittingDate,
                  sittingTime: dataManipulationService.publicationTimeInBst(sitting['sittingStart']),
                  courtRoom: courtRoom['courtRoomName'],
                  joh: session['formattedJudiciaries'],
                  durationAsHours: sitting['durationAsHours'],
                  durationAsMinutes: sitting['durationAsMinutes'],
                  formattedDuration: sitting['formattedDuration'],
                  caseNumber: thisCase['caseNumber'],
                  caseSeparator: thisCase['caseSequenceIndicator'],
                  linkedCases: thisCase['linkedCases'],
                  hearingNotes: hearing['listingNotes'],
                  defendant: formattedName[1].toUpperCase() + ', ' + formattedName[0],
                  defendantRepresentative: hearing['defendantRepresentative'],
                  prosecutingAuthority: hearing['prosecutingAuthority'],
                  hearingType: hearing['hearingType'],
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
    const uniqueCourts = dataManipulationService.uniquesInArrayByAttrib(data, 'courtName');
    let courtCounter = 0;
    function compare (a, b) {
      if (a.courtRoom.toLowerCase().includes('to be allocated')){return 1;} return -1;}
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
        const thisDayCourts = [];
        const formattedDay = moment.utc(day).tz(this.timeZone).format('dddd DD MMMM YYYY');
        const record = courtData.filter(row => row.sittingDate === formattedDay);
        const uniqueCourtRooms = dataManipulationService.uniquesInArrayByAttrib(record, 'courtRoom');
        Array.from(uniqueCourtRooms).forEach(courtRoom => {
          const room = record.filter(row => row.courtRoom === courtRoom);
          thisDayCourts.push({'courtRoom': courtRoom, data: room});
        });
        thisDayCourts.sort(compare);
        courts[courtCounter]['days'].push(thisDayCourts);
      });
      courtCounter += 1;
    });
    return courts;
  }

}
