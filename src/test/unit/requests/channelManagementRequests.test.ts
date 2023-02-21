import { channelManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { ChannelManagementRequests } from '../../../main/resources/requests/channelManagementRequests';
import sinon from 'sinon';

const getStoredFilesEndpoint = '/publication/abc';

const dummyData = {
    pdf: '123',
    excel: '456',
};

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
    describe('Get stored files', () => {
        afterEach(() => {
            sinon.restore();
        });

        it('should return media applications', async () => {
            getStub.withArgs(getStoredFilesEndpoint).resolves({ data: dummyData });
            expect(await channelManagementRequests.getStoredFiles('abc')).toEqual(dummyData);
        });

        it('should return empty array and an error response if get fails', async () => {
            getStub.withArgs(getStoredFilesEndpoint).rejects(errorResponse);
            expect(await channelManagementRequests.getStoredFiles('abc')).toEqual(null);
        });

        it('should return empty array and an error response if request fails', async () => {
            getStub.withArgs(getStoredFilesEndpoint).rejects(errorMessage);
            expect(await channelManagementRequests.getStoredFiles('abc')).toEqual(null);
        });
    });
});
