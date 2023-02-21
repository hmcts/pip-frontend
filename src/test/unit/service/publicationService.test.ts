import sinon from 'sinon';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';

import { PublicationRequests } from '../../../main/resources/requests/publicationRequests';
import { PublicationService } from '../../../main/service/publicationService';

const caseNameValue = 'test';
const caseNumberValue = '123';
const caseUrnValue = '456';
const caseName = 'test name 1';
const userId = '123';

const returnedArtefact = [
    {
        artefactId: '123',
        search: {
            cases: [
                { caseNumber: '123', caseName: 'test name 1', caseUrn: '321' },
                { caseNumber: '321', caseName: 'NaMe TesT', caseUrn: '456' },
                { caseNumber: '432', caseName: 'not in', caseUrn: '867' },
            ],
        },
    },
];

const countPerLocation = [
    {
        locationId: 1,
        totalArtefacts: 2,
    },
    {
        locationId: 3,
        totalArtefacts: 1,
    },
];

const publicationService = new PublicationService();
const publicationRequestStub = sinon.stub(PublicationRequests.prototype, 'getPublicationByCaseValue');
publicationRequestStub.resolves(returnedArtefact);

const publicationRequests = PublicationRequests.prototype;

const rawDailyCauseData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');

const dailyCauseListData = JSON.parse(rawDailyCauseData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const stub = sinon.stub(publicationRequests, 'getIndividualPublicationJson');
stub.returns(dailyCauseListData);
stub.withArgs().returns(dailyCauseListData);

const stubMetaData = sinon.stub(publicationRequests, 'getIndividualPublicationMetadata');
stubMetaData.returns(metaData);

const stubCourtPubs = sinon.stub(publicationRequests, 'getPublicationsByCourt');
stubCourtPubs.withArgs('1', userId, false).resolves(returnedArtefact);
stubCourtPubs.withArgs('2', userId, false).resolves([]);
sinon.stub(publicationRequests, 'getPubsPerLocation').returns(countPerLocation);
const validCourtName = 'PRESTON';
const invalidCourtName = 'TEST';

describe('Publication service', () => {
    it('should return array of Search Objects based on partial case name', async () => {
        const results = await publicationService.getCasesByCaseName(caseNameValue, userId);
        expect(results.length).to.equal(2);
        expect(results).not.contain(returnedArtefact[0].search.cases[2]);
    });

    it('should return one case if it exists in multiple artefacts', async () => {
        const results = await publicationService.getCasesByCaseName(caseName, userId);
        expect(results.length).to.equal(1);
        expect(results).to.contain(returnedArtefact[0].search.cases[0]);
    });

    it('should return Search Object matching case number', async () => {
        expect(await publicationService.getCaseByCaseNumber(caseNumberValue, userId)).to.equal(
            returnedArtefact[0].search.cases[0]
        );
    });

    it('should return Search Object matching case urn', async () => {
        expect(await publicationService.getCaseByCaseUrn(caseUrnValue, userId)).to.equal(
            returnedArtefact[0].search.cases[1]
        );
    });

    it('should return null processing failed request', async () => {
        expect(await publicationService.getCaseByCaseUrn('invalid', userId)).is.equal(null);
    });

    it('should return list types', () => {
        const listTypes = publicationService.getListTypes();
        expect(listTypes.size).to.equal(19);

        const sjpResult = listTypes.get('SJP_PUBLIC_LIST');
        expect(sjpResult['friendlyName']).to.equal('Single Justice Procedure Public List');
        expect(sjpResult['shortenedFriendlyName']).to.equal('SJP Public List');
        expect(sjpResult['url']).to.equal('sjp-public-list');
        expect(sjpResult['jurisdictions']).to.deep.equal(['Single Justice Procedure']);
        expect(sjpResult['restrictedProvenances']).to.deep.equal([]);
    });

    describe('getIndivPubJson Service', () => {
        it('should return publication json', () => {
            return publicationService.getIndividualPublicationJson('', userId).then(data => {
                expect(data['courtLists'].length).to.equal(4);
            });
        });

        it('should have valid court name in the venue object', () => {
            return publicationService.getIndividualPublicationJson('', userId).then(data => {
                expect(data['venue']['venueName']).to.equal(validCourtName);
            });
        });

        it('should have valid court name in the venue object', () => {
            return publicationService.getIndividualPublicationJson('', userId).then(data => {
                expect(data['venue']['venueName']).not.equal(invalidCourtName);
            });
        });
    });

    describe('getIndivPubMetadata Publication Service', () => {
        it('should return publication meta object', () => {
            return publicationService.getIndividualPublicationMetadata('', userId).then(data => {
                expect(data['contentDate']).to.equal('2022-02-14T14:14:59.73967');
            });
        });
    });

    describe('getPublicationsByCourt Publication Service', () => {
        it('should return artefact for a valid call', async () => {
            const data = await publicationService.getPublicationsByCourt('1', userId);
            expect(data).to.deep.equal(returnedArtefact);
        });
        it('should return empty list for a invalid call', async () => {
            const data = await publicationService.getPublicationsByCourt('2', userId);
            expect(data).to.deep.equal([]);
        });
    });

    describe('Count of locationIds->pubs endpoint', () => {
        it('should return a list of locationIds alongside the relevant number of publications', async () => {
            const data = await publicationService.getCountsOfPubsPerLocation();
            const expectedMap = new Map();
            expectedMap.set(1, 2);
            expectedMap.set(3, 1);
            expect(data).to.deep.equal(expectedMap);
        });
    });

    describe('Language to load the page in', () => {
        it('should return english if the user is english and the list is english', () => {
            expect(publicationService.languageToLoadPageIn('ENGLISH', 'en')).to.equal('en');
        });

        it('should return bilingual if the user is english and the list is welsh', () => {
            expect(publicationService.languageToLoadPageIn('WELSH', 'en')).to.equal('bill');
        });

        it('should return bilingual if the user is english and the list is bilingual', () => {
            expect(publicationService.languageToLoadPageIn('BI_LINGUAL', 'en')).to.equal('bill');
        });

        it('should return welsh if the user is welsh and the list is welsh', () => {
            expect(publicationService.languageToLoadPageIn('WELSH', 'cy')).to.equal('cy');
        });

        it('should return bilingual if the user is welsh and the list is english', () => {
            expect(publicationService.languageToLoadPageIn('ENGLISH', 'cy')).to.equal('bill');
        });

        it('should return bilingual if the user is welsh and the list is bilingual', () => {
            expect(publicationService.languageToLoadPageIn('BI_LINGUAL', 'cy')).to.equal('bill');
        });
    });

    describe('Get Default Sensitivity', () => {
        it('return default sensitivity where there is a match', () => {
            expect(publicationService.getDefaultSensitivity('SJP_PRESS_LIST')).to.equal('CLASSIFIED');
        });

        it('return blank string where there is no match', () => {
            expect(publicationService.getDefaultSensitivity('UNKNOWN_LIST_TYPE')).to.equal('');
        });
    });
});
