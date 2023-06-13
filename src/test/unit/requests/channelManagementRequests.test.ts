import { channelManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { ChannelManagementRequests } from '../../../main/resources/requests/channelManagementRequests';
import sinon from 'sinon';

const getStoredFileEndpoint = '/publication/v2/abc';

const dummyData = '123';
const userId = 'abc';

const errorResponse = {
    response: {
        data: 'test error',
    },
};

const errorMessage = {
    message: 'test',
};

const channelManagementRequests = new ChannelManagementRequests();
const getStub = sinon.stub(channelManagementApi, 'get');

describe('Channel Management requests', () => {
    describe('Get stored file', () => {
        afterEach(() => {
            sinon.restore();
        });

        it('should return publication', async () => {
            getStub.withArgs(getStoredFileEndpoint).resolves({ data: dummyData });
            expect(
                await channelManagementRequests.getStoredFile('abc', { 'x-user-id': userId, 'x-file-type': 'PDF' })
            ).toEqual(dummyData);
        });

        it('should return null and an error response if get fails', async () => {
            getStub.withArgs(getStoredFileEndpoint).rejects(errorResponse);
            expect(
                await channelManagementRequests.getStoredFile('abc', { 'x-user-id': userId, 'x-file-type': 'PDF' })
            ).toEqual(null);
        });

        it('should return empty array and an error response if request fails', async () => {
            getStub.withArgs(getStoredFileEndpoint).rejects(errorMessage);
            expect(
                await channelManagementRequests.getStoredFile('abc', { 'x-user-id': userId, 'x-file-type': 'EXCEL' })
            ).toEqual(null);
        });
    });
});
