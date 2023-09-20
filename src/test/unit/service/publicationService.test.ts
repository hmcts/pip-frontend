import sinon from 'sinon';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';

import { PublicationRequests } from '../../../main/resources/requests/publicationRequests';
import { PublicationService } from '../../../main/service/publicationService';

const caseNumberValue = '123';
const caseUrnValue = '456';
const fullCaseNameValue = 'test name 1';
const partialCaseNameValue = 'test';
const uppercaseCaseNameValue = 'TEST NAME 2';
const partialPartyNameValue = 'PARTYNAME';
const mixedCasePartyNameValue = 'ParTYNamE3';
const userId = '123';

const returnedArtefact = [
    {
        artefactId: '123',
        search: {
            cases: [
                { caseNumber: '123', caseName: 'test name 1', caseUrn: '321' },
                { caseNumber: '321', caseName: 'NaMe TesT', caseUrn: '456' },
                { caseNumber: '432', caseName: 'not in', caseUrn: '867' },
                { caseNumber: '998', caseUrn: '888' },
                { caseNumber: '999', caseName: 'test name 2' },
                { caseName: 'test name 3', caseUrn: '889' },
            ],
            parties: [
                {
                    cases: [{ caseNumber: '123', caseName: 'test name 1', caseUrn: '321' }],
                    organisations: ['PARTYNAME1'],
                    individuals: [
                        {
                            forename: 'FORENAME',
                            surname: 'PARTYNAME2',
                        },
                    ],
                },
                {
                    cases: [{ caseNumber: '321', caseName: 'NaMe TesT', caseUrn: '456' }],
                    organisations: ['PARTYNAME3'],
                    individuals: [],
                },
                {
                    cases: [{ caseNumber: '432', caseName: 'not in', caseUrn: '867' }],
                    organisations: [],
                    individuals: [],
                },
                {
                    cases: [
                        { caseNumber: '998', caseUrn: '888' },
                        { caseNumber: '999', caseName: 'test name 2' },
                    ],
                    organisations: [],
                    individuals: [{ surname: 'PARTYNAME4' }],
                },
                {
                    cases: [{ caseName: 'test name 3', caseUrn: '889' }],
                    organisations: [],
                    individuals: [],
                },
            ],
        },
    },
];

const returnedCasesWithUrnFlag = [
    {
        caseNumber: '123',
        caseName: 'test name 1',
        caseUrn: '321',
        partyNames: 'FORENAME PARTYNAME2,\nPARTYNAME1',
        displayUrn: true,
    },
    { caseNumber: '321', caseName: 'NaMe TesT', caseUrn: '456', partyNames: 'PARTYNAME3', displayUrn: true },
    { caseNumber: '432', caseName: 'not in', caseUrn: '867', displayUrn: true },
    { caseNumber: '998', caseUrn: '888', displayUrn: true },
];

const countPerLocation = [
    {
        locationId: '1',
        totalArtefacts: 2,
    },
    {
        locationId: '3',
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

const requester = 'Test';
const stubPublicationDeletion = sinon.stub(PublicationRequests.prototype, 'deleteLocationPublication');
stubPublicationDeletion.withArgs(1, requester).returns('success');
stubPublicationDeletion.withArgs(2, requester).returns(null);

describe('Publication service', () => {
    it('should return array of Search Objects based on partial case name', async () => {
        const results = await publicationService.getCasesByCaseName(partialCaseNameValue, userId);
        expect(results.length).to.equal(6);
        expect(results)
            .not.contain(returnedArtefact[0].search.cases[2])
            .not.contain(returnedArtefact[0].search.cases[3])
            .not.contain(returnedArtefact[0].search.cases[5])
            .not.contain(returnedCasesWithUrnFlag[2])
            .not.contain(returnedCasesWithUrnFlag[3]);
    });

    it('should return one case if it exists in multiple artefacts', async () => {
        const results = await publicationService.getCasesByCaseName(fullCaseNameValue, userId);

        expect(results.length).to.equal(2);
        expect(results[0]).to.eql({
            ...returnedArtefact[0].search.cases[0],
            partyNames: 'FORENAME PARTYNAME2,\nPARTYNAME1',
        });
        expect(JSON.stringify(results[1])).to.eql(JSON.stringify(returnedCasesWithUrnFlag[0]));
    });

    it('should return search case for case name with mismatched casing', async () => {
        const results = await publicationService.getCasesByCaseName(uppercaseCaseNameValue, userId);

        expect(results.length).to.equal(1);
        expect(results[0]).to.eql({
            ...returnedArtefact[0].search.cases[4],
            partyNames: 'PARTYNAME4',
        });
    });

    it('should return Search Object matching case number', async () => {
        const result = await publicationService.getCaseByCaseNumber(caseNumberValue, userId);

        expect(result).to.eql({
            ...returnedArtefact[0].search.cases[0],
            partyNames: 'FORENAME PARTYNAME2,\nPARTYNAME1',
        });
    });

    it('should return array of Search Objects based on partial party name', async () => {
        const results = await publicationService.getCasesByPartyName(partialPartyNameValue, userId);
        expect(results).to.have.length(7);

        expect(results[0]).to.eql({
            ...returnedArtefact[0].search.cases[0],
            partyNames: 'FORENAME PARTYNAME2,\nPARTYNAME1',
        });

        expect(results[1]).to.eql({
            ...returnedArtefact[0].search.cases[0],
            partyNames: 'FORENAME PARTYNAME2,\nPARTYNAME1',
            displayUrn: true,
        });

        expect(results[2]).to.eql({
            ...returnedArtefact[0].search.cases[1],
            partyNames: 'PARTYNAME3',
        });

        expect(results[3]).to.eql({
            ...returnedArtefact[0].search.cases[1],
            partyNames: 'PARTYNAME3',
            displayUrn: true,
        });

        expect(results[4]).to.eql({
            ...returnedArtefact[0].search.cases[3],
            partyNames: 'PARTYNAME4',
        });

        expect(results[5]).to.eql({
            ...returnedArtefact[0].search.cases[3],
            partyNames: 'PARTYNAME4',
            displayUrn: true,
        });

        expect(results[6]).to.eql({
            ...returnedArtefact[0].search.cases[4],
            partyNames: 'PARTYNAME4',
        });
    });

    it('should return search case for party name with mismatched casing', async () => {
        const results = await publicationService.getCasesByPartyName(mixedCasePartyNameValue, userId);
        expect(results).to.have.length(2);

        expect(results[0]).to.eql({
            ...returnedArtefact[0].search.cases[1],
            partyNames: 'PARTYNAME3',
        });

        expect(results[1]).to.eql({
            ...returnedArtefact[0].search.cases[1],
            partyNames: 'PARTYNAME3',
            displayUrn: true,
        });
    });

    it('should return Search Object matching case urn', async () => {
        const result = await publicationService.getCaseByCaseUrn(caseUrnValue, userId);

        expect(result).to.eql({
            ...returnedArtefact[0].search.cases[1],
            partyNames: 'PARTYNAME3',
        });
    });

    it('should return null processing failed request', async () => {
        expect(await publicationService.getCaseByCaseUrn('invalid', userId)).is.equal(null);
    });

    it('should return list types', () => {
        const listTypes = publicationService.getListTypes();
        expect(listTypes.size).to.equal(20);

        const sjpResult = listTypes.get('SJP_PUBLIC_LIST');
        expect(sjpResult['friendlyName']).to.equal('Single Justice Procedure Public List');
        expect(sjpResult['shortenedFriendlyName']).to.equal('SJP Public List');
        expect(sjpResult['url']).to.equal('sjp-public-list');
        expect(sjpResult['jurisdictions']).to.deep.equal(['Magistrates']);
        expect(sjpResult['restrictedProvenances']).to.deep.equal([]);

        const sjpDeltaResult = listTypes.get('SJP_DELTA_PRESS_LIST');
        expect(sjpDeltaResult['friendlyName']).to.equal('Single Justice Procedure Press List (New Cases)');
        expect(sjpDeltaResult['shortenedFriendlyName']).to.equal('SJP Press List (New cases)');
        expect(sjpDeltaResult['url']).to.equal('sjp-press-list-new-cases');
        expect(sjpDeltaResult['jurisdictions']).to.deep.equal(['Magistrates']);
        expect(sjpDeltaResult['restrictedProvenances']).to.deep.equal(['PI_AAD']);
    });

    describe('getIndividualPublicationJson Service', () => {
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

    describe('getIndividualPublicationMetadata Publication Service', () => {
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
            expectedMap.set('1', 2);
            expectedMap.set('3', 1);
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

    describe('delete location publication', () => {
        it('should return a message if location subscription is deleted', async () => {
            const payload = await publicationService.deleteLocationPublication(1, requester);
            expect(payload).to.deep.equal('success');
        });

        it('should return null if publication delete failed', async () => {
            const payload = await publicationService.deleteLocationPublication(2, requester);
            expect(payload).to.deep.equal(null);
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
