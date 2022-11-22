import { formatDate } from '../../helpers/dateTimeHelper';
import { DataManipulationService } from '../dataManipulationService';
import moment from 'moment-timezone';

export class EtListsService {
  public dataManipulationService = new DataManipulationService();

  /**
   * Reshaping etDailyList json data into formatted niceness.
   */
  public reshapeEtDailyListData(etDailyList: string): object {
    const etDailyListData = JSON.parse(etDailyList);
    let hearingCount = 0;
    etDailyListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['formattedJudiciary'] = this.dataManipulationService.getJudiciaryNameSurname(session);
          delete session['judiciary'];
          session['sittings'].forEach(sitting => {
            hearingCount = hearingCount + sitting['hearing'].length;
            sitting['sittingStartFormatted'] = formatDate(sitting['sittingStart'], 'h:mma');
            this.dataManipulationService.calculateDuration(sitting);
            this.dataManipulationService.findAndConcatenateHearingPlatform(sitting, session);
            sitting['hearing'].forEach(hearing => {
              this.dataManipulationService.findAndManipulatePartyInformation(hearing, true);
            });
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });
    return etDailyListData;
  }

  /**
   * Reshaping etDailyList json data into formatted niceness. It first loops through to populate fields in a nice way,
   * then loops through again to split data into days. Not O(1) but I think the world is just gonna have to deal.
   */
  public reshapeEtFortnightlyListData(etFortList: string): object {
    const etFortnightlyListData = JSON.parse(etFortList);
    let hearingCount = 0;
    etFortnightlyListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['formattedJudiciary'] =this.dataManipulationService.getJudiciaryNameSurname(session);
          delete session['judiciary'];
          session['sittings'].forEach(sitting => {
            hearingCount = hearingCount + sitting['hearing'].length;
            sitting['sittingStartFormatted'] = formatDate(sitting['sittingStart'], 'h:mma');
            this.dataManipulationService.calculateDuration(sitting);
            this.dataManipulationService.findAndConcatenateHearingPlatform(sitting, session);
            sitting['hearing'].forEach(hearing => {
              this.dataManipulationService.findAndManipulatePartyInformation(hearing, true);
            });
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });
    return this.dataSplitterEtList(etFortnightlyListData);
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
   * Nasty wee function that builds a horrible data structure that gets parsed by the template.
   * @param data - the ingested et fortnightly list
   * @private cos it's for local
   */
  private splitByCourtAndDate(data: any) {
    const courts = [];
    const uniqueCourts =this.dataManipulationService.uniquesInArrayByAttrib(data, 'courtName');
    let courtCounter = 0;
    uniqueCourts.forEach(court => {
      const courtData = data.filter(row => row.courtName === court);
      courts.push({'courtName': court, days: []});
      const uniqueDays =this.dataManipulationService.uniquesInArrayByAttrib(courtData, 'sittingDate');
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
