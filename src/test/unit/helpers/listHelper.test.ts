import sinon from 'sinon';
import { addListDetailsToArray, hearingHasParty } from '../../../main/helpers/listHelper';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/PublicationService';

const mockArtefact = {
    listType: 'CIVIL_DAILY_CAUSE_LIST',
    listTypeName: 'Civil Daily Cause List',
    contentDate: '2022-03-24T07:36:35',
    locationId: '5',
    artefactId: 'valid-artefact',
    dateRange: 'Invalid DateTime to Invalid DateTime',
    contDate: '24 Mar 2022'
};

sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(mockArtefact);

describe('List helper', () => {
    it('Hearing should have party', () => {
        const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/hearingparty/crownDailyList.json'), 'utf-8');
        expect(hearingHasParty(JSON.parse(rawData))).toBeTruthy();
    });

    it('Hearing should have no party', () => {
        const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/crownDailyList.json'), 'utf-8');
        expect(hearingHasParty(JSON.parse(rawData))).toBeFalsy();
    });

    it('Should add list details to an array', async () => {
        const expectedResult = [
            {
                listType: 'CIVIL_DAILY_CAUSE_LIST',
                listTypeName: 'Civil Daily Cause List',
                contentDate: '2022-03-24T07:36:35',
                locationId: '5',
                artefactId: 'valid-artefact',
                dateRange: 'Invalid DateTime to Invalid DateTime',
                contDate: '24 Mar 2022'
            },
        ];
        const list = [];
        await addListDetailsToArray('artfactId', 1, list);
        expect(list).toEqual(expectedResult);
    });
});
