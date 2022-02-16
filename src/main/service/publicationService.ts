import {PublicationRequests} from '../resources/requests/publicationRequests';
import {Artefact} from '../models/Artefact';
import {SearchObject} from '../models/searchObject';

const publicationRequests = new PublicationRequests();

export class PublicationService {

  public async getCasesByCaseName(caseName: string, verified: boolean): Promise<SearchObject[]> {
    const artefacts = await publicationRequests.getPublicationByCaseValue('CASE_NAME', caseName, verified);
    return this.getFuzzyCasesFromArtefact(artefacts, caseName);
  }

  public async getCaseByCaseNumber(caseNumber: string, verified: boolean): Promise<SearchObject> {
    const artefact = await publicationRequests.getPublicationByCaseValue('CASE_ID', caseNumber, verified);
    return this.getCaseFromArtefact(artefact[0], 'caseNumber', caseNumber);
  }

  public async getCaseByCaseUrn(urn: string, verified: boolean): Promise<SearchObject> {
    const artefact = await publicationRequests.getPublicationByCaseValue('CASE_URN', urn, verified);
    return this.getCaseFromArtefact(artefact[0], 'caseUrn', urn);
  }

  public async getPublicationsByCourt(courtId: string, verified: boolean): Promise<Artefact[]> {
    return await publicationRequests.getPublicationsByCourt(courtId, verified);
  }

  private getCaseFromArtefact(artefact: Artefact, term: string, value: string): SearchObject {
    let foundObject: SearchObject;
    artefact.search.cases.forEach(singleCase => {
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
