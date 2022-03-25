import {PublicationRequests} from '../resources/requests/publicationRequests';
import {Artefact} from '../models/Artefact';
import {SearchObject} from '../models/searchObject';
import moment from 'moment';

const publicationRequests = new PublicationRequests();

export class PublicationService {

  public async getIndividualPublicationMetadata(artefactId, verification: boolean): Promise<any> {
    return publicationRequests.getIndividualPublicationMetadata(artefactId, verification);
  }

  public async getIndividualPublicationFile(artefactId, verification: boolean): Promise<Blob> {
    return publicationRequests.getIndividualPublicationFile(artefactId, verification);
  }

  public async getIndividualPublicationJson(artefactId, verification: boolean): Promise<JSON> {
    return publicationRequests.getIndividualPublicationJson(artefactId, verification);
  }

  public async getCasesByCaseName(caseName: string, verified: boolean): Promise<SearchObject[]> {
    const artefacts = await publicationRequests.getPublicationByCaseValue('CASE_NAME', caseName, verified);
    return this.getFuzzyCasesFromArtefact(artefacts, caseName);
  }

  public async getCaseByCaseNumber(caseNumber: string, verified: boolean): Promise<SearchObject> | null {
    const artefact = await publicationRequests.getPublicationByCaseValue('CASE_ID', caseNumber, verified);
    return this.getCaseFromArtefact(artefact[0], 'caseNumber', caseNumber);
  }

  public async getCaseByCaseUrn(urn: string, verified: boolean): Promise<SearchObject> | null{
    const artefact = await publicationRequests.getPublicationByCaseValue('CASE_URN', urn, verified);
    return this.getCaseFromArtefact(artefact[0], 'caseUrn', urn);
  }

  public async getPublicationsByCourt(courtId: string, verified: boolean): Promise<Artefact[]> {
    return await publicationRequests.getPublicationsByCourt(courtId, verified);
  }

  public manipulatedDailyListData(dailyCauseList: string): object {
    const dailyCauseListData = JSON.parse(dailyCauseList);
    let hearingCount = 0;
    dailyCauseListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          this.findAndManipulateJudiciary(session);
          session['sittings'].forEach(sitting => {
            this.calculateDuration(sitting);
            hearingCount = hearingCount + sitting['hearing'].length;
            this.findAndConcatenateHearingPlatform(sitting, session);

            sitting['hearing'].forEach(hearing => {
              this.findAndManipulatePartyInformation(hearing);
            });
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });

    return dailyCauseListData;
  }

  private calculateDuration(sitting: object): void {
    sitting['duration'] = '';
    sitting['startTime'] = '';
    if (sitting['sittingStart'] !== '' && sitting['sittingEnd'] !== '') {
      const sittingStart = moment(sitting['sittingStart']);
      const sittingEnd = moment(sitting['sittingEnd']);

      let durationAsHours = 0;
      let durationAsMinutes = moment.duration(sittingEnd.startOf('minutes').diff(sittingStart.startOf('minutes'))).asMinutes();
      if (durationAsMinutes >= 60) {
        durationAsHours = moment.duration(sittingEnd.startOf('hours').diff(sittingStart.startOf('hours'))).asHours();
        durationAsMinutes = durationAsMinutes - (durationAsHours * 60);
      }

      sitting['durationAsHours'] = durationAsHours;
      sitting['durationAsMinutes'] = durationAsMinutes;
      sitting['time'] = moment(sittingStart).format('HH:mm');
      const min = moment(sitting['sittingStart'], 'HH:mm').minutes();
      if (min === 0) {
        sitting['startTime'] = moment(sitting['sittingStart']).format('ha');
      } else {
        sitting['startTime'] = moment(sitting['sittingStart']).format('h.mma');
      }
    }
  }

  private findAndConcatenateHearingPlatform(sitting: object, session: object): void {
    let caseHearingChannel = '';
    if(sitting['channel'].length > 0) {
      caseHearingChannel = sitting['channel'].join(', ');
    } else if(session['sessionChannel'].length > 0) {
      caseHearingChannel = session['sessionChannel'].join(', ');
    }
    sitting['caseHearingChannel'] = caseHearingChannel;
  }

  private findAndManipulateJudiciary(session: object) {
    let judiciaries = '';
    let foundPresiding = false;
    session['judiciary'].forEach(judiciary => {
      if(judiciary?.isPresiding ===  true) {
        judiciaries = this.writeStringIfValid(judiciary?.johTitle) + ' ' + judiciary.johNameSurname;
        foundPresiding = true;
      } else if (!foundPresiding){
        judiciaries += this.writeStringIfValid(judiciary?.johTitle) + ' ' + judiciary.johNameSurname + ', ';
      }
    });

    if(!foundPresiding) {
      judiciaries = judiciaries.slice(0, -2);
    }

    session['formattedJudiciaries'] = judiciaries;
  }

  private findAndManipulatePartyInformation(hearing: any): void {
    let applicant;
    let respondant;

    if(hearing?.party) {
      hearing.party.forEach(party => {
        //APPLICANT
        switch(party.partyRole) {
          case 'APPLICANT_PETITIONER':
          {
            applicant = this.createIndividualDetails(party.individualDetails);
            applicant?.length > 0 ? applicant += ', ' : '';
            break;
          }
          case 'APPLICANT_PETITIONER_REPRESENTATIVE':
          {
            applicant += party?.friendlyRoleName;

            if(party?.friendlyRoleName.length > 0) {
              applicant += ': ';
            }
            applicant += this.createIndividualDetails(party.individualDetails);
            break;
          }
          case 'RESPONDANT':
          {
            respondant = this.createIndividualDetails(party.individualDetails);
            respondant?.length > 0 ? respondant += ', ' : '';
            break;
          }
          case 'RESPONDANT_REPRESENTATIVE':
          {
            respondant += party?.friendlyRoleName;
            if(party?.friendlyRoleName.length > 0) {
              respondant += ': ';
            }
            respondant += this.createIndividualDetails(party.individualDetails);
            break;
          }

        }
      });
      hearing['applicant'] = applicant.trim();
      hearing['respondant'] = respondant.trim();
    }
  }

  private createIndividualDetails(individualDetails: any): string {
    return this.writeStringIfValid(individualDetails?.title) + ' '
      + this.writeStringIfValid(individualDetails?.individualForenames) + ' '
      + this.writeStringIfValid(individualDetails?.individualMiddleName) + ' '
      + this.writeStringIfValid(individualDetails?.individualSurname);
  }

  private writeStringIfValid(stringToCheck) {
    if (stringToCheck) {
      return stringToCheck;
    } else {
      return '';
    }
  }

  private getCaseFromArtefact(artefact: Artefact, term: string, value: string): SearchObject {
    let foundObject: SearchObject = null;
    artefact?.search.cases.forEach(singleCase => {
      if (singleCase[term] == value) {
        foundObject = singleCase;
      }
    });
    return foundObject;
  }

  private getFuzzyCasesFromArtefact(artefacts: Artefact[], value: string): SearchObject[] {
    const matches: SearchObject[] = [];
    artefacts.forEach(artefact => {
      artefact.search.cases.forEach(singleCase => {
        if (singleCase.caseName.toLowerCase().includes(value.toLowerCase())) {
          matches.push(singleCase);
        }
      });
    });
    return matches;
  }

  public formatSJPPressList(sjpPressListJson: string): object {
    let hearingCount = 0;
    const sjpPressListData = JSON.parse(sjpPressListJson);
    sjpPressListData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['sittings'].forEach(sitting => {
            sitting['hearing'].forEach(hearing => {
              hearingCount++;
              hearing['party'].forEach(party => {
                if (party['individualDetails']) {
                  party['individualDetails']['formattedDateOfBirth'] = moment(party['individualDetails']['dateOfBirth'].split('/').reverse().join('-')).format('D MMMM YYYY');
                }
              });

              hearing['offence'].forEach(offence => {
                const reportingRestriction = offence['reportingRestriction'].toString();
                offence['formattedReportingRestriction'] = reportingRestriction.charAt(0).toUpperCase() + reportingRestriction.slice(1);
              });
            });
          });
        });
      });
    });

    sjpPressListData['hearingCount'] = hearingCount;

    return sjpPressListData;
  }
}
