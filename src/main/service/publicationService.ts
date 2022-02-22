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

  public calculateHearingSessionTime(searchResults: JSON): void {
    let hearingCount = 0;
    searchResults['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['sittings'].forEach(sitting => {
            sitting['duration'] = '';
            sitting['startTime'] = '';
            if (sitting['sittingStart'] !== '' && sitting['sittingEnd'] !== '') {
              const sittingStart = moment(sitting['sittingStart']);
              const sittingEnd = moment(sitting['sittingEnd']);

              //CALCULATE DURATION
              let durationAsHours = 0;
              let durationAsMinutes = moment.duration(sittingEnd.startOf('minutes').diff(sittingStart.startOf('minutes'))).asMinutes();
              if (durationAsMinutes >= 60) {
                durationAsHours = moment.duration(sittingEnd.startOf('hours').diff(sittingStart.startOf('hours'))).asHours();
                durationAsMinutes = durationAsMinutes - (durationAsHours * 60);
              }

              sitting['durationAsHours'] = durationAsHours;
              sitting['durationAsMinutes'] = durationAsMinutes;

              const min = moment(sitting['sittingStart'], 'HH:mm').minutes();
              if (min === 0) {
                sitting['startTime'] = moment(sitting['sittingStart']).format('ha');
              } else {
                sitting['startTime'] = moment(sitting['sittingStart']).format('h.mma');
              }
            }
            hearingCount = hearingCount + sitting['hearing'].length;
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });
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
}
