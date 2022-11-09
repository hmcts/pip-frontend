import moment from 'moment-timezone';
import {DataManipulationService} from '../dataManipulationService';
import {DateTimeHelper} from '../../helpers/dateTimeHelper';
import {CrownDailyListService} from './crownDailyListService';

const dataManipulationService = new DataManipulationService();
const dailyListService = new CrownDailyListService();
const dateTimeHelper = new DateTimeHelper();

export class CrownFirmListService {
  public timeZone = 'Europe/London';

  /**
   * Builds list of courthouses, does general formatting to make it appear nice, then is passed to second function which
   * deals with the splitting it by various dimensions (i.e. courthouse -> day -> courtRoom -> allocated/unallocated.
   * @param firmList
   * @param language
   * @param languageFile
   */
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
                  hearingPlatform: sitting['caseHearingChannel'],
                };
                rows.push(row);
              });
            });
          });
        });
      });
    });
    return this.splitByCourtAndDateAndAllocation(rows);
  }

  /**
   * Splits the formatted list from above into three different dimensions:
   * 1) First the cases are split by courtHouse
   * 2) Then, the data within each courthouse is split by day
   * 3) Then the data for each day/courtHouse pair is split by courtRoom.
   * After the splitting, the method ensures that all unallocated cases always fall at the end of the cases in the
   * current courtHouse/day/courtRoom using some array shuffling magic.
   * @param data
   * @private
   */
  private splitByCourtAndDateAndAllocation(data: any) {
    const courts = [];
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
        const thisDayCourts = [];
        const formattedDay = moment.utc(day).tz(this.timeZone).format('dddd DD MMMM YYYY');
        const record = courtData.filter(row => row.sittingDate === formattedDay);
        const uniqueCourtRooms = dataManipulationService.uniquesInArrayByAttrib(record, 'courtRoom');
        Array.from(uniqueCourtRooms).forEach(courtRoom => {
          const room = record.filter(row => row.courtRoom === courtRoom);
          thisDayCourts.push({'courtRoom': courtRoom, data: room});
        });
        // custom sort def - basically if it's got the string, move to end. Needed to be suppressed because eslint
        // does not understand that a compare function needs two vars.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function compare (a, b) {
          if (a.courtRoom.toLowerCase().includes('to be allocated')){return 1;} return -1;}
        // custom sort usage below
        thisDayCourts.sort(compare);
        courts[courtCounter]['days'].push(thisDayCourts);
      });
      courtCounter += 1;
    });
    return courts;
  }

}
