import {PublicationRequests} from '../resources/requests/publicationRequests';
import {Artefact} from '../models/Artefact';
import {SearchObject} from '../models/searchObject';
import moment from 'moment-timezone';

const publicationRequests = new PublicationRequests();

export class PublicationService {

  public timeZone = 'Europe/London';

  public async getIndividualPublicationMetadata(artefactId, userId: string, admin = false): Promise<any> {
    return publicationRequests.getIndividualPublicationMetadata(artefactId, userId, admin);
  }

  public async getIndividualPublicationFile(artefactId, userId: string): Promise<Blob> {
    return publicationRequests.getIndividualPublicationFile(artefactId, userId);
  }

  public async getIndividualPublicationJson(artefactId, userId: string): Promise<JSON> {
    return publicationRequests.getIndividualPublicationJson(artefactId, userId);
  }

  public async getCasesByCaseName(caseName: string, userId: string): Promise<SearchObject[]> {
    const artefacts = await publicationRequests.getPublicationByCaseValue('CASE_NAME', caseName, userId);
    return this.getFuzzyCasesFromArtefact(artefacts, caseName);
  }

  public async getCaseByCaseNumber(caseNumber: string, userId: string): Promise<SearchObject> | null {
    const artefact = await publicationRequests.getPublicationByCaseValue('CASE_ID', caseNumber, userId);
    return this.getCaseFromArtefact(artefact[0], 'caseNumber', caseNumber);
  }

  public async getCaseByCaseUrn(urn: string, userId: string): Promise<SearchObject> | null{
    const artefact = await publicationRequests.getPublicationByCaseValue('CASE_URN', urn, userId);
    return this.getCaseFromArtefact(artefact[0], 'caseUrn', urn);
  }

  public async getPublicationsByCourt(locationId: string, userId: string): Promise<Artefact[]> {
    return await publicationRequests.getPublicationsByCourt(locationId, userId, false);
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
      const sittingStart = moment.utc(sitting['sittingStart']);
      const sittingEnd = moment.utc(sitting['sittingEnd']);

      let durationAsHours = 0;
      let durationAsMinutes = moment.duration(sittingEnd.startOf('minutes').diff(sittingStart.startOf('minutes'))).asMinutes();
      if (durationAsMinutes >= 60) {
        durationAsHours = moment.duration(sittingEnd.startOf('hours').diff(sittingStart.startOf('hours'))).asHours();
        durationAsMinutes = durationAsMinutes - (durationAsHours * 60);
      }

      sitting['durationAsHours'] = durationAsHours;
      sitting['durationAsMinutes'] = durationAsMinutes;
      sitting['time'] = moment.utc(sitting['sittingStart']).tz(this.timeZone).format('HH:mm');
      const min = moment(sitting['sittingStart'], 'HH:mm').minutes();
      if (min === 0) {
        sitting['startTime'] = moment.utc(sitting['sittingStart']).tz(this.timeZone).format('ha');
      } else {
        sitting['startTime'] = moment.utc(sitting['sittingStart']).tz(this.timeZone).format('h.mma');
      }
    }
  }

  private findAndConcatenateHearingPlatform(sitting: object, session: object): void {
    let caseHearingChannel = '';
    if(sitting['channel']?.length > 0) {
      caseHearingChannel = sitting['channel'].join(', ');
    } else if(session['sessionChannel'].length > 0) {
      caseHearingChannel = session['sessionChannel'].join(', ');
    }
    sitting['caseHearingChannel'] = caseHearingChannel;
  }

  private findAndManipulateJudiciary(session: object): void {
    let judiciaries = '';
    let foundPresiding = false;
    session['judiciary']?.forEach(judiciary => {
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
    let respondent;

    if(hearing?.party) {
      hearing.party.forEach(party => {
        switch(party.partyRole) {
          case 'APPLICANT_PETITIONER':
          {
            applicant = this.createIndividualDetails(party.individualDetails);
            applicant += this.stringDelimiter(applicant?.length, ',');
            break;
          }
          case 'APPLICANT_PETITIONER_REPRESENTATIVE':
          {
            applicant += party?.friendlyRoleName;
            applicant += this.stringDelimiter(party?.friendlyRoleName.length, ':');
            applicant += this.createIndividualDetails(party.individualDetails);
            break;
          }
          case 'RESPONDENT':
          {
            respondent = this.createIndividualDetails(party.individualDetails);
            respondent += this.stringDelimiter(respondent?.length, ',');
            break;
          }
          case 'RESPONDENT_REPRESENTATIVE':
          {
            respondent += party?.friendlyRoleName;
            respondent += this.stringDelimiter(party?.friendlyRoleName.length, ':');
            respondent += this.createIndividualDetails(party.individualDetails);
            break;
          }

        }
      });
      hearing['applicant'] = applicant?.trim();
      hearing['respondent'] = respondent?.trim();
    }
  }

  private createIndividualDetails(individualDetails: any): string {
    return this.writeStringIfValid(individualDetails?.title) + ' '
      + this.writeStringIfValid(individualDetails?.individualForenames) + ' '
      + this.writeStringIfValid(individualDetails?.individualMiddleName) + ' '
      + this.writeStringIfValid(individualDetails?.individualSurname);
  }

  private writeStringIfValid(stringToCheck): string {
    if (stringToCheck) {
      return stringToCheck;
    } else {
      return '';
    }
  }

  private stringDelimiter(stringSize: number, delimiter: string): string {
    if (stringSize > 0) {
      return `${delimiter} `;
    }
    return '';
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
          const alreadyExists = matches.find(m => m.caseName === singleCase.caseName
          && m.caseUrn === singleCase.caseUrn
          && m.caseNumber === singleCase.caseNumber);
          if(!alreadyExists) {
            matches.push(singleCase);
          }
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

  public async removePublication(artefactId: string, email: string): Promise<boolean> {
    return publicationRequests.deletePublication(artefactId, email);
  }

  /**
   * Function which extracts the time from a UTC Date Time in BST format.
   * @param publicationDatetime The publication date time to convert in UTC.
   */
  public publicationTimeInBst(publicationDatetime: string): string {
    const min = moment.utc(publicationDatetime, 'HH:mm').tz(this.timeZone).minutes();
    let publishedTime = '';
    if (min === 0) {
      publishedTime = moment.utc(publicationDatetime).tz(this.timeZone).format('ha');
    } else {
      publishedTime = moment.utc(publicationDatetime).tz(this.timeZone).format('h.mma');
    }
    return publishedTime;
  }

  /**
   * Function which extracts the date from a UTC Date Time in BST format.
   * @param publicationDatetime The publication date time to convert in UTC.
   */
  public publicationDateInBst(publicationDatetime: string): string {
    return moment.utc(publicationDatetime).tz(this.timeZone).format('DD MMMM YYYY');
  }

}
