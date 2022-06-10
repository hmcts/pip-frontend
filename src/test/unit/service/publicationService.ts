import sinon from 'sinon';
import {PublicationRequests} from '../../../main/resources/requests/publicationRequests';
import {PublicationService} from '../../../main/service/publicationService';

const caseNameValue = 'test';
const caseNumberValue = '123';
const caseUrnValue = '456';
const caseName = 'test name 1';
const userId = '123';

const returnedArtefact = [{
  artefactId: '123',
  search: {
    cases: [
      {caseNumber: '123', caseName: 'test name 1', caseUrn: '321'},
      {caseNumber: '321', caseName: 'NaMe TesT', caseUrn: '456'},
      {caseNumber: '432', caseName: 'not in', caseUrn: '867'}],
  },
},{
  artefactId: '1232',
  search: {
    cases: [
      {caseNumber: '123', caseName: 'test name 1', caseUrn: '321'}],
  },
}];

const publicationService = new PublicationService;
const publicationRequestStub = sinon.stub(PublicationRequests.prototype, 'getPublicationByCaseValue');
publicationRequestStub.resolves(returnedArtefact);
describe('Publication service', () => {
  it('should return array of Search Objects based on partial case name', async () => {
    const results = await publicationService.getCasesByCaseName(caseNameValue, userId);
    expect(results.length).toBe(2);
    expect(results).not.toContain(returnedArtefact[0].search.cases[2]);
  });

  it('should return one case if it exists in multiple artefacts', async () => {
    const results = await publicationService.getCasesByCaseName(caseName, userId);
    expect(results.length).toBe(1);
    expect(results).toContain(returnedArtefact[0].search.cases[0]);
  });

  it('should return Search Object matching case number', async () => {
    expect(await publicationService.getCaseByCaseNumber(caseNumberValue, userId)).toEqual(returnedArtefact[0].search.cases[0]);
  });

  it('should return Search Object matching case urn', async () => {
    expect(await publicationService.getCaseByCaseUrn(caseUrnValue, userId)).toEqual(returnedArtefact[0].search.cases[1]);
  });
});
