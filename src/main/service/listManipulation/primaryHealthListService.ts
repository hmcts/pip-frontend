import { DataManipulationService } from '../dataManipulationService';
import moment from 'moment-timezone';

const dataManipulationService = new DataManipulationService();

/**
 * Service to manipulate the primary health list nunjucks template.
 */
export class PrimaryHealthListService {

  /**
   * Method to manipulate the data and return an object of the formatted data.
   */
  public manipulateData(stringList: string): object {
    const listData = JSON.parse(stringList);
    const allData = [];

    listData['courtLists'].forEach(courtList => {
      const venueAddress = this.formatVenueAddress(courtList['courtHouse']['courtHouseName'],
        courtList['courtHouse']['courtHouseAddress']);

      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          const hearingDate = this.formatSessionStart(session['sessionStartTime']);

          session['sittings'].forEach(sitting => {
            dataManipulationService.calculateDuration(sitting);
            const durationAsHours = sitting['durationAsHours'];
            const durationAsMinutes = sitting['durationAsMinutes'];
            let durationAsDays = 0;

            if(durationAsHours >= 24) {
              durationAsDays = Math.floor(durationAsHours / 24);
            }

            sitting['hearing'].forEach(hearing => {
              const hearingType = hearing['hearingType'];

              hearing['case'].forEach(courtCase => {
                const caseName = courtCase.caseName;
                const caseSequenceIndicator = courtCase.caseSequenceIndicator;

                allData.push(this.formatCase(hearingDate, caseName, durationAsDays, durationAsHours,
                  durationAsMinutes, caseSequenceIndicator, hearingType, venueAddress));
              });
            });
          });
        });
      });
    });
    return allData;
  }

  /**
   * Format the data into an object, then pass back for further processing.
   */
  private formatCase(hearingDate, caseName, durationAsDays, durationAsHours, durationAsMinutes,
    caseSequenceIndicator, hearingType, venue) {
    return {
      hearingDate: hearingDate,
      caseName: caseName,
      durationAsDays: durationAsDays,
      durationAsHours: durationAsHours,
      durationAsMinutes: durationAsMinutes,
      caseSequenceIndicator: caseSequenceIndicator,
      hearingType: hearingType,
      venue: venue,
    };
  }

  /**
   * Format the session start date (hearing date) into the correct format.
   */
  private formatSessionStart(sessionStart: string): string {
    return moment.utc(sessionStart).tz(dataManipulationService.timeZone).format('DD MMMM');
  }

  /**
   * Format and concatenate the venue name and address only if the venue name is not empty or null.
   */
  private formatVenueAddress(courtHouseName: string, courtHouseAddress: object): string {
    let formattedVenueAddress = '';
    if(/\S/.test(courtHouseName) && courtHouseName !== null) {
      formattedVenueAddress = courtHouseName;
      courtHouseAddress['line'].forEach(line => {
        formattedVenueAddress += '\n' + line;
      });
      formattedVenueAddress += '\n' + courtHouseAddress['postCode'];
    }
    return formattedVenueAddress;
  }
}
