import sinon from 'sinon';
import { dataManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { CaseEventGlossaryRequests } from '../../../main/resources/requests/caseEventGlossaryRequests';
import fs from 'fs';
import path from 'path';

const searchDescriptionRequests = new CaseEventGlossaryRequests();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/CaseEventGlossary.json'), 'utf-8');
const caseEventGlossaryData = JSON.parse(rawData);

const stub = sinon.stub(dataManagementApi, 'get');

describe('getCaseEventGlossaryList()', () => {
    it('should return list of 49 case events status', async () => {
        stub.withArgs('/glossary').resolves({ data: caseEventGlossaryData });
        return await searchDescriptionRequests.getCaseEventGlossaryList().then(data => {
            expect(data.length).toBe(49);
        });
    });

    it('should return null for error response', async () => {
        stub.withArgs('/glossary').resolves(Promise.reject({ response: { data: 'test error' } }));
        expect(await searchDescriptionRequests.getCaseEventGlossaryList()).toHaveLength(0);
    });

    it('should return first glossary as Adjourned', async () => {
        stub.withArgs('/glossary').resolves({ data: caseEventGlossaryData });
        return await searchDescriptionRequests.getCaseEventGlossaryList().then(data => {
            expect(data[0].name).toEqual('Adjourned');
        });
    });

    it('should not have description for the first glossary', async () => {
        stub.withArgs('/glossary').resolves({ data: caseEventGlossaryData });
        return await searchDescriptionRequests.getCaseEventGlossaryList().then(data => {
            expect(data[0].description).not.toBeNull();
        });
    });

    it('should have  name and description for all case event glossary', async () => {
        let i = 0;
        stub.withArgs('/glossary').resolves({ data: caseEventGlossaryData });
        return await searchDescriptionRequests.getCaseEventGlossaryList().then(data => {
            expect(data[i].name).not.toBeNull();
            expect(data[i].description).not.toBeNull();
            i++;
        });
    });
});
