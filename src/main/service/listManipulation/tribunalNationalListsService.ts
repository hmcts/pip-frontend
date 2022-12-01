import { DataManipulationService } from '../dataManipulationService';
import {formatDate, formatDuration} from '../../helpers/dateTimeHelper';

const dataManipulationService = new DataManipulationService();

/**
 * Service to manipulate the primary health list nunjucks template.
 */
export class TribunalNationalListsService {

  /**
   * Method to manipulate the data and return an object of the formatted data.
   */
  public manipulateData(stringList: string, language: string, languageFile: string): object {
    const listData = JSON.parse(stringList);
    const allData = [];

    listData['courtLists'].forEach(courtList => {
      const venueAddress = this.formatVenueAddress(courtList['courtHouse']['courtHouseName'],
        courtList['courtHouse']['courtHouseAddress']);

      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          const hearingDate = formatDate(session['sessionStartTime'], 'DD MMMM');
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
                  durationAsMinutes, caseSequenceIndicator, hearingType, venueAddress, language, languageFile));
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
    caseSequenceIndicator, hearingType, venue, language, languageFile) {
    return {
      hearingDate: hearingDate,
      caseName: caseName,
      durationAsDays: durationAsDays,
      durationAsHours: durationAsHours,
      durationAsMinutes: durationAsMinutes,
      formattedDuration: formatDuration(durationAsDays as number,
        durationAsHours as number, durationAsMinutes as number, language, languageFile),
      caseSequenceIndicator: caseSequenceIndicator,
      hearingType: hearingType,
      venue: venue,
    };
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
      formattedVenueAddress += courtHouseAddress['town'] ? '\n' + courtHouseAddress['town'] : '';
      formattedVenueAddress += courtHouseAddress['county'] ? '\n' + courtHouseAddress['county'] : '';
      formattedVenueAddress += courtHouseAddress['postCode'] ? '\n' + courtHouseAddress['postCode'] : '';
    }
    return formattedVenueAddress;
  }
}
