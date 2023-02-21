import sinon from 'sinon';
import { dataManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { LiveCaseRequests } from '../../../main/resources/requests/liveCaseRequests';

const liveCaseRequests = new LiveCaseRequests();

const mockData = {
    data: {
        test: 'testData',
    },
};

const stub = sinon.stub(dataManagementApi, 'get');

describe('Live case get requests', () => {
    it('should get live cases and return data', async () => {
        stub.resolves(Promise.resolve(mockData));
        expect(await liveCaseRequests.getLiveCases(1)).toBe(mockData.data);
    });

    it('should return null for error response', async () => {
        stub.resolves(Promise.reject({ response: { data: 'test error' } }));
        expect(await liveCaseRequests.getLiveCases(2)).toBe(null);
    });
});
