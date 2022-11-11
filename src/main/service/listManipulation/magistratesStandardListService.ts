import moment from 'moment-timezone';
import {DataManipulationService} from '../dataManipulationService';
import {DateTimeHelper} from '../../helpers/dateTimeHelper';

const dataManipulationService = new DataManipulationService();
const dateTimeHelper = new DateTimeHelper();

export class MagistratesStandardListService {
  public manipulatedMagsStandardListData(magsStandardListData: object, language: string, languageFile: string): object {
    magsStandardListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          const allDefendants = [];
          session['sittings'].forEach(sitting => {
            const judiciary = dataManipulationService.findAndManipulateJudiciary(sitting);
            if (judiciary !== '') {
              session['formattedJudiciaries'] = judiciary;
            }
            this.formatCaseTime(sitting, 'h:mma');
            sitting['formattedDuration'] = dateTimeHelper.formatDuration(sitting['durationAsDays'] as number,
              sitting['durationAsHours'] as number, sitting['durationAsMinutes'] as number, language, languageFile);
            sitting['hearing'].forEach(hearing => {
              if (hearing?.party) {
                hearing.party.forEach(party => {
                  const allOffences = [];
                  const hearingString = JSON.stringify(hearing);
                  const hearingObject = JSON.parse(hearingString);

                  this.manipulateHearingObject(hearingObject, party);
                  if (hearingObject['defendantHeading'] !== '') {
                    hearingObject['offence'].forEach(offence => {
                      allOffences.push(this.formatOffence(offence['offenceTitle'], hearingObject['plea'], 'Need to confirm',
                        hearingObject['formattedConvictionDate'], hearingObject['formattedAdjournedDate'], offence['offenceWording']));
                    });

                    allDefendants.push(this.formatDefendant(hearingObject['defendantHeading'], hearingObject['gender'], hearingObject['inCustody'],
                      sitting['time'], sitting['formattedDuration'], hearingObject['caseSequenceIndicator'],
                      hearingObject['defendantDateOfBirth'], hearingObject['age'],
                      hearingObject['defendantAddress'], hearingObject['prosecutionAuthorityCode'], hearingObject['hearingNumber'],
                      sitting['caseHearingChannel'], hearingObject['caseNumber'], hearingObject['hearingType'], hearingObject['panel'], allOffences));
                  }
                });
              }
            });
          });
          session['defendants'] = this.combineDefendantSittings(allDefendants);;
        });
      });
    });

    return magsStandardListData;
  }

  private combineDefendantSittings(allDefendants): object {
    const defendantsPerSessions = [];
    const uniqueDefendantNames = dataManipulationService.uniquesInArrayByAttrib(allDefendants, 'defendantHeading');
    uniqueDefendantNames.forEach(defendantNames => {
      const defendant = allDefendants.filter(row => row.defendantHeading === defendantNames);
      defendantsPerSessions.push({'defendantHeading': defendantNames, defendantInfo: defendant});
    });
    return defendantsPerSessions;
  }

  private manipulateHearingObject(hearingObject, party) {
    this.manipulatePartyInformation(hearingObject, party);
    hearingObject['case'].forEach(thisCase => {
      hearingObject['formattedConvictionDate'] = dateTimeHelper.formatDate(thisCase['convictionDate'], 'DD/MM/YYYY');
      hearingObject['formattedAdjournedDate'] = dateTimeHelper.formatDate(thisCase['adjournedDate'], 'DD/MM/YYYY');
      hearingObject['caseSequenceIndicator'] = thisCase['caseSequenceIndicator'];
      hearingObject['hearingNumber'] = thisCase['hearingNumber'];
      hearingObject['prosecutionAuthorityCode'] = thisCase['informant']['prosecutionAuthorityCode'];
      hearingObject['caseNumber'] = thisCase['caseNumber'];
      hearingObject['panel'] = thisCase['panel'];
    });
  }

  private formatOffence(offenceTitle, plea, dateOfPlea, formattedConvictionDate, formattedAdjournedDate, offenceWording) {
    return {
      offenceTitle: offenceTitle,
      plea: plea,
      dateOfPlea: dateOfPlea,
      formattedConvictionDate: formattedConvictionDate,
      formattedAdjournedDate: formattedAdjournedDate,
      offenceWording: offenceWording,
    };
  }

  private formatDefendant(defendantHeading, gender, inCustody, time,
    formattedDuration, caseSequenceIndicator, defendantDateOfBirth, age, defendantAddress,
    prosecutionAuthorityCode, hearingNumber, caseHearingChannel, caseNumber,
    hearingType, panel, allOffences) {
    return {
      defendantHeading: this.formatDefendantHeading(defendantHeading, gender, inCustody),
      gender: gender,
      inCustody: inCustody,
      time: time,
      formattedDuration: formattedDuration,
      caseSequenceIndicator: caseSequenceIndicator,
      defendantDateOfBirth: defendantDateOfBirth,
      age: age,
      defendantAddress: defendantAddress,
      prosecutionAuthorityCode: prosecutionAuthorityCode,
      hearingNumber: hearingNumber,
      caseHearingChannel: caseHearingChannel,
      caseNumber: caseNumber,
      hearingType: hearingType,
      panel: panel,
      allOffences: allOffences,
    };
  }

  private formatDefendantHeading(name, gender, inCustody): String{
    let defendantHeading = name;
    if (gender?.length > 0) {
      defendantHeading += ' (' + gender + ')';
    }

    if (inCustody?.length > 0) {
      defendantHeading += inCustody;
    }
    return defendantHeading;
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
    }

    hearing['defendantHeading'] = defendant?.replace(/,\s*$/, '').trim();
    hearing['defendantDateOfBirth'] = party?.individualDetails?.dateOfBirth;
    hearing['defendantAddress'] = this.formatDefendantAddress(party.individualDetails?.address);
    hearing['age'] = party?.individualDetails?.age;
    hearing['gender'] = party?.individualDetails?.gender;
    hearing['plea'] = party?.individualDetails?.plea;
    if (party?.individualDetails?.inCustody) {
      hearing['inCustody'] = party.individualDetails?.inCustody === true ? '*' : '';
    }
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
