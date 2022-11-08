import moment from 'moment-timezone';
import {DataManipulationService} from '../dataManipulationService';
import {DateTimeHelper} from '../../helpers/dateTimeHelper';

const dataManipulationService = new DataManipulationService();
const dateTimeHelper = new DateTimeHelper();

export class MagsStandardListService {
  public manipulatedMagsStandardListData(magsStandardListData: object, language: string, languageFile: string): object {
    let hearingCount = 0;
    magsStandardListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['sittings'].forEach(sitting => {
            const allHearings = [];
            session['formattedJudiciaries'] = dataManipulationService.findAndManipulateJudiciary(sitting);
            this.formatCaseTime(sitting, 'h:mma');
            sitting['formattedDuration'] = dateTimeHelper.formatDuration(sitting['durationAsDays'] as number,
              sitting['durationAsHours'] as number, sitting['durationAsMinutes'] as number, language, languageFile);
            hearingCount = hearingCount + sitting['hearing'].length;
            sitting['hearing'].forEach(hearing => {
              if (hearing?.party) {
                hearing.party.forEach(party => {
                  const hearingString = JSON.stringify(hearing);
                  const hearingObject = JSON.parse(hearingString);
                  this.manipulatePartyInformation(hearingObject, party);
                  hearingObject['case'].forEach(thisCase => {
                    thisCase['formattedConvictionDate'] = dateTimeHelper.formatDate(thisCase['convictionDate'], 'DD/MM/YYYY');
                    thisCase['formattedAdjournedDate'] = dateTimeHelper.formatDate(thisCase['adjournedDate'], 'DD/MM/YYYY');
                  });
                  allHearings.push(hearingObject);
                });
              }
            });
            sitting['hearing'] = allHearings;
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });

    return magsStandardListData;
  }

  private formatCaseTime(sitting: object, format: string): void {
    if (sitting['sittingStart'] !== '') {
      sitting['time'] = moment.utc(sitting['sittingStart']).tz(dataManipulationService.timeZone).format(format);
    }
  }

  private manipulatePartyInformation(hearing: any, party: any): void {
    let defendant = '';

    if (DataManipulationService.convertPartyRole(party.partyRole) === 'DEFENDANT') {
      defendant = this.createIndividualDetails(party.individualDetails).trim();
      defendant += dataManipulationService.stringDelimiter(defendant?.length, ',');
    }

    hearing['defendantHeading'] = defendant?.replace(/,\s*$/, '').trim();
    hearing['defendantDateOfBirth'] = party?.individualDetails?.dateOfBirth;
    hearing['defendantAddress'] = this.formatDefendantAddress(party.individualDetails?.address);
    hearing['age'] = party?.individualDetails?.age;
    hearing['gender'] = party?.individualDetails?.gender;
    hearing['plea'] = party?.individualDetails?.plea;
  }

  private createIndividualDetails(individualDetails: any): string {

    const forenames = dataManipulationService.writeStringIfValid(individualDetails?.individualForenames);
    const surname = dataManipulationService.writeStringIfValid(individualDetails?.individualSurname);

    return surname + (surname.length > 0 ? ', ' : '')
      + forenames;
  }

  private formatDefendantAddress(defendantAddress: object): string {
    let formattedAddress = '';
    if (defendantAddress !== null) {
      defendantAddress['line'].forEach(line => {
        formattedAddress += formattedAddress.length > 0 ? ', ' + line : line;
      });
      formattedAddress += defendantAddress['town'] ? ', ' + defendantAddress['town'] : '';
      formattedAddress += defendantAddress['county'] ? ', ' + defendantAddress['county'] : '';
      formattedAddress += defendantAddress['postCode'] ? ', ' + defendantAddress['postCode'] : '';
    }

    return formattedAddress.replace(/,\s*$/, '').trim();
  }
}
