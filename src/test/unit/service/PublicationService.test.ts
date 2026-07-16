import sinon from 'sinon';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';

import { PublicationRequests } from '../../../main/resources/requests/PublicationRequests';
import { PublicationService } from '../../../main/service/PublicationService';

const caseNumberValue = '123';
const invalidCaseNumberValue = '124';
const fullCaseNameValue = 'test name 1';
const partialCaseNameValue = 'test';
const uppercaseCaseNameValue = 'TEST NAME 2';
const userId = '123';

const returnedCaseNameSearchResults = [
    { caseNumber: '123', caseName: fullCaseNameValue },
    { caseNumber: '321', caseName: uppercaseCaseNameValue },
];

const returnedCaseNumberSearchResults = [{ caseNumber: caseNumberValue, caseName: fullCaseNameValue }];

const returnedArtefact = [
    {
        artefactId: '123',
    },
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

const getCasesByCaseNameStub = sinon.stub(PublicationRequests.prototype, 'getCasesByCaseName');
getCasesByCaseNameStub.withArgs(partialCaseNameValue, userId, true).resolves(returnedCaseNameSearchResults);
getCasesByCaseNameStub.withArgs(partialCaseNameValue, userId, false).resolves([]);

const getCasesByCaseNumberStub = sinon.stub(PublicationRequests.prototype, 'getCasesByCaseNumber');
getCasesByCaseNumberStub.withArgs(caseNumberValue).resolves(returnedCaseNumberSearchResults);
getCasesByCaseNumberStub.withArgs(invalidCaseNumberValue).resolves([]);

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

const stubPublicationsByLocation = sinon.stub(publicationRequests, 'getPublicationsByLocation');
stubPublicationsByLocation.withArgs('1').resolves(returnedArtefact);
stubPublicationsByLocation.withArgs('2').resolves([]);

sinon.stub(publicationRequests, 'getPubsPerLocation').returns(countPerLocation);
const validCourtName = 'PRESTON';
const invalidCourtName = 'TEST';

const adminUserId = '1234';
const stubPublicationDeletion = sinon.stub(PublicationRequests.prototype, 'deleteLocationPublication');
stubPublicationDeletion.withArgs(1, adminUserId).returns('success');
stubPublicationDeletion.withArgs(2, adminUserId).returns(null);

sinon.stub(PublicationRequests.prototype, 'getNoMatchPublications').resolves('{"item":"listOfPubs"}');

const stubGetListSearchConfig = sinon.stub(PublicationRequests.prototype, 'getListSearchConfigByListType');
const stubCreateListSearchConfig = sinon.stub(PublicationRequests.prototype, 'createListSearchConfig');
const stubUpdateListSearchConfig = sinon.stub(PublicationRequests.prototype, 'updateListSearchConfig');

describe('Publication service', () => {
    it('should return array of case search results based on partial case name using fuzzy search', async () => {
        const results = await publicationService.getCasesByCaseName(partialCaseNameValue, userId, true);
        expect(results.length).to.equal(2);
        expect(results[0].caseName).to.equal(fullCaseNameValue);
        expect(results[1].caseName).to.equal(uppercaseCaseNameValue);
    });

    it('should return empty array based on partial case name using exact search', async () => {
        const results = await publicationService.getCasesByCaseName(partialCaseNameValue, userId);
        expect(results).to.be.empty;
    });

    it('should return single case search results matching case number', async () => {
        const result = await publicationService.getCaseByCaseNumber(caseNumberValue, userId);
        expect(result.caseNumber).to.equal(caseNumberValue);
        expect(result.caseName).to.equal(fullCaseNameValue);
    });

    it('should return null for unmatched case number', async () => {
        const result = await publicationService.getCaseByCaseNumber(invalidCaseNumberValue, userId);
        expect(result).to.be.null;
    });

    it('should return list types', () => {
        const listTypes = publicationService.getListTypes();
        expect(listTypes.size).to.equal(95);

        const sjpResult = listTypes.get('SJP_PUBLIC_LIST');
        expect(sjpResult['friendlyName']).to.equal('Single Justice Procedure Public List (Full List)');
        expect(sjpResult['shortenedFriendlyName']).to.equal('SJP Public List (Full list)');
        expect(sjpResult['url']).to.equal('sjp-public-list');
        expect(sjpResult['jurisdictionTypes']).to.deep.equal(['Magistrates Court']);
        expect(sjpResult['restrictedProvenances']).to.deep.equal([]);

        const sjpDeltaResult = listTypes.get('SJP_DELTA_PRESS_LIST');
        expect(sjpDeltaResult['friendlyName']).to.equal('Single Justice Procedure Press List (New Cases)');
        expect(sjpDeltaResult['shortenedFriendlyName']).to.equal('SJP Press List (New cases)');
        expect(sjpDeltaResult['url']).to.equal('sjp-press-list-new-cases');
        expect(sjpDeltaResult['jurisdictionTypes']).to.deep.equal(['Magistrates Court']);
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

    describe('getPublicationsByLocation', () => {
        it('should return artefact for a valid call', async () => {
            const data = await publicationService.getPublicationsByLocation('1', userId);
            expect(data).to.deep.equal(returnedArtefact);
        });
        it('should return empty list for a invalid call', async () => {
            const data = await publicationService.getPublicationsByLocation('2', userId);
            expect(data).to.deep.equal([]);
        });
    });

    describe('getNoMatchPublications', () => {
        it('should return a list of noMatch publications', async () => {
            expect(await publicationService.getNoMatchPublications('123-456')).to.equal('{"item":"listOfPubs"}');
        });
    });

    describe('Count of locationIds->pubs endpoint', () => {
        it('should return a list of locationIds alongside the relevant number of publications', async () => {
            const data = await publicationService.getCountsOfPubsPerLocation('123-456');
            const expectedMap = new Map();
            expectedMap.set('1', 2);
            expectedMap.set('3', 1);
            expect(data).to.deep.equal(expectedMap);
        });
    });

    describe('delete location publication', () => {
        it('should return a message if location publication is deleted', async () => {
            const payload = await publicationService.deleteLocationPublication(1, adminUserId);
            expect(payload).to.deep.equal('success');
        });

        it('should return null if publication delete failed', async () => {
            const payload = await publicationService.deleteLocationPublication(2, adminUserId);
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

    describe('List search config', () => {
        const listType = 'CIVIL_DAILY_CAUSE_LIST';
        const listSearchConfigId = '123-456';
        const listSearchConfig = {
            id: listSearchConfigId,
            listType: listType,
            caseNumberFieldName: 'caseNumber',
            caseNameFieldName: 'caseName',
        };

        const listSearchConfigForCreateRequest = {
            id: '',
            listType: listType,
            caseNumberFieldName: 'caseNumber',
            caseNameFieldName: 'caseName',
        };

        const requesterId = '1';
        const requesterId2 = '2';

        stubGetListSearchConfig.withArgs(listType, requesterId).returns(listSearchConfig);
        stubGetListSearchConfig.withArgs(listType, requesterId2).returns(null);

        stubCreateListSearchConfig.withArgs(listSearchConfigForCreateRequest, requesterId).returns(true);
        stubCreateListSearchConfig.withArgs(listSearchConfigForCreateRequest, requesterId2).returns(false);

        stubUpdateListSearchConfig.withArgs(listSearchConfigId, listSearchConfig, requesterId).returns(true);
        stubUpdateListSearchConfig.withArgs(listSearchConfigId, listSearchConfig, requesterId2).returns(false);

        it('should return list search config if exists', async () => {
            let result = await publicationService.getListSearchConfigByListType(listType, requesterId);
            expect(result).is.not.empty;
            expect(result.listType).to.equal(listType);
            expect(result.caseNumberFieldName).to.equal('caseNumber');
            expect(result.caseNameFieldName).to.equal('caseName');

            result = await publicationService.getListSearchConfigByListType(listType, requesterId2);
            expect(result).is.null;
        });

        it('should create list search config if request successful', async () => {
            expect(await publicationService.createListSearchConfig(listSearchConfig, requesterId)).is.true;
            expect(await publicationService.createListSearchConfig(listSearchConfig, requesterId2)).is.false;
        });

        it('should update list search config if request successful', async () => {
            expect(await publicationService.updateListSearchConfig(listSearchConfigId, listSearchConfig, requesterId))
                .is.true;
            expect(await publicationService.updateListSearchConfig(listSearchConfigId, listSearchConfig, requesterId2))
                .is.false;
        });
    });
});
