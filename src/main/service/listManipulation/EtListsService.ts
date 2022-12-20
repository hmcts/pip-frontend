import { formatDate } from '../../helpers/dateTimeHelper';
import { ListParseHelperService } from '../listParseHelperService';
import moment from 'moment-timezone';

export class EtListsService {
  public helperService = new ListParseHelperService();

  /**
   * Reshaping et List json data into formatted niceness.
   */
  public reshapeEtLists(listData: string): object {
    const jsonData = JSON.parse(listData);
    jsonData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['formattedJudiciary'] = this.helperService.getJudiciaryNameSurname(session);
          delete session['judiciary'];
          session['sittings'].forEach(sitting => {
            sitting['sittingStartFormatted'] = formatDate(sitting['sittingStart'], 'h:mma');
            this.helperService.calculateDuration(sitting);
            this.helperService.findAndConcatenateHearingPlatform(sitting, session);
            sitting['hearing'].forEach(hearing => {
              this.helperService.findAndManipulatePartyInformation(hearing, true);
            });
          });
        });
      });
    });
    return jsonData;
  }

  /**
   * Reshaping etDailyList json data into formatted niceness. It first loops through to populate fields in a nice way,
   * then loops through again to split data into days. Not O(1) but I think the world is just gonna have to deal.
   */
  public reshapeEtFortnightlyListData(etFortList: string): object {
    return this.dataSplitterEtList(this.reshapeEtLists(etFortList));
  }

  /**
   * Method which runs through an et fortnightly list and splits it out into courtHouses and days.
   * @param inputList - input et daily list json.
   * @private - cos it's internal.
   */
  private dataSplitterEtList(inputList: any): any {
    const rows = [];
    inputList['courtLists'].forEach(courtList => {
      const courtName = courtList['courtHouse']['courtHouseName'];
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['sittings'].forEach(sitting => {
            const sittingDate = formatDate(sitting['sittingStart'], 'dddd DD MMMM YYYY');
            sitting['hearing'].forEach(hearing => {
              hearing['case'].forEach(thisCase => {
                const row = {
                  courtName: courtName,
                  sittingDate: sittingDate,
                  sittingTime: formatDate(sitting['sittingStart'], 'h:mma'),
                  addressLine: courtList['courtHouse']['courtHouseAddress']['line'],
                  addressTown: courtList['courtHouse']['courtHouseAddress']['town'],
                  addressCounty: courtList['courtHouse']['courtHouseAddress']['county'],
                  addressPostCode: courtList['courtHouse']['courtHouseAddress']['postCode'],
                  courtRoom: courtRoom['courtRoomName'],
                  durationAsHours: sitting['durationAsHours'],
                  durationAsMinutes: sitting['durationAsMinutes'],
                  caseNumber: thisCase['caseNumber'],
                  caseSeparator: thisCase['caseSequenceIndicator'],
                  claimant: hearing['appellant'],
                  claimantRep: hearing['appellantRepresentative'],
                  respondent: hearing['respondent'],
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
    return this.splitByCourtAndDate(rows);
  }

  /**
   * Splits the already courtHouse/Date paired data and transforms it into courthouse/Date/courtRoom/allocation,
   * with the allocated cases presented at the bottom of the given courtHouse.
   * @param data - the ingested et fortnightly list
   * @private cos it's for local
   */
  private splitByCourtAndDate(data: any) {
    const courts = [];
    const uniqueCourts =this.helperService.uniquesInArrayByAttrib(data, 'courtName');
    let courtCounter = 0;
    uniqueCourts.forEach(court => {
      const courtData = data.filter(row => row.courtName === court);
      courts.push({'courtName': court, days: []});
      const uniqueDays =this.helperService.uniquesInArrayByAttrib(courtData, 'sittingDate');
      const uniqueDaysArr = [];
      Array.from(uniqueDays).forEach(day => {
        const encDay = moment.utc(day, 'dddd DD MMMM YYYY').tz('Europe/London');
        uniqueDaysArr.push(encDay);
      });
      uniqueDaysArr.sort(function(a, b) {
        return a - b;
      });
      uniqueDaysArr.forEach(day => {
        const formattedDay = moment.utc(day).tz('Europe/London').format('dddd DD MMMM YYYY');
        const record = courtData.filter(row => row.sittingDate === formattedDay);
        courts[courtCounter]['days'].push(record);
      });
      courtCounter += 1;
    });
    return courts;
  }
}
