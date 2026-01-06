import { PactV4, MatchersV3 } from '@pact-foundation/pact';
import fs from 'fs';
import path from 'path';
import { DataManagementRequests } from '../../main/resources/requests/DataManagementRequests';
import { dataManagementApi } from '../../main/resources/requests/utils/axiosConfig';

const rawData = fs.readFileSync(path.resolve(__dirname, '../unit/mocks/civilAndFamilyDailyCauseList.json'), 'utf-8');
const civilAndFamilyDailyCauseListData = JSON.parse(rawData);

jest.mock('../../main/resources/requests/utils/axiosConfig', () => {
    const actualAxios = jest.requireActual('axios');
    return {
        dataManagementApi: actualAxios.create({
            baseURL: 'http://placeholder.com',
            timeout: 20000,
        })
    };
});

const dataManagementRequests = new DataManagementRequests();

describe('upload json publication contract', () => {
    const provider = new PactV4({
        consumer: 'frontend-app',
        provider: 'data-management-service',
        dir: path.resolve(process.cwd(), 'src/test/pact/contracts'),
    });

    it('should upload JSON publication successfully', async () => {
        await provider
            .addInteraction()
            .given('user is authorised to upload JSON publication')
            .uponReceiving('a request to upload JSON publication')
            .withRequest('POST', '/publication', (req) => {
                req
                    .headers({
                        'x-provenance': 'MANUAL_UPLOAD',
                        'x-source-artefact-id': 'test-source-id',
                        'x-type': 'LIST',
                        'x-sensitivity': 'PUBLIC',
                        'x-language': 'ENGLISH',
                        'x-display-from': '2026-01-01T00:00:00',
                        'x-display-to': '2027-01-01T23:59:59',
                        'x-list-type': 'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
                        'x-court-id': '9',
                        'x-content-date': '2026-01-01T00:00:00',
                        'x-requester-id': 'b760814f-dc71-4904-95ae-473fb5aed45b',
                        'Content-Type': 'application/json'
                    })
                    .jsonBody(civilAndFamilyDailyCauseListData);
            })
            .willRespondWith(201, (res) => {
                res
                    .jsonBody({
                        artefactId: MatchersV3.uuid()
                    });
            })
            .executeTest(async (mockServer) => {
                dataManagementApi.defaults.baseURL = mockServer.url;

                const result = await dataManagementRequests.uploadJSONPublication(
                    { file: civilAndFamilyDailyCauseListData },
                    {
                        'x-provenance': 'MANUAL_UPLOAD',
                        'x-source-artefact-id': 'test-source-id',
                        'x-type': 'LIST',
                        'x-sensitivity': 'PUBLIC',
                        'x-language': 'ENGLISH',
                        'x-display-from': '2026-01-01T00:00:00',
                        'x-display-to': '2027-01-01T23:59:59',
                        'x-list-type': 'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
                        'x-court-id': '9',
                        'x-content-date': '2026-01-01T00:00:00',
                        'x-requester-id': 'b760814f-dc71-4904-95ae-473fb5aed45b',
                        'Content-Type': 'application/json'
                    }
                );

                expect(result).toBeDefined();
                expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
            });
    });
});
