import { channelManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { ChannelManagementRequests } from '../../../main/resources/requests/channelManagementRequests';
import sinon from 'sinon';

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

const fileSizeData = {
    primaryPdf: 1234,
    additionalPdf: null,
    excel: 123,
};

const channelManagementRequests = new ChannelManagementRequests();

const getStub = sinon.stub(channelManagementApi, 'get');

getStub.withArgs('/publication/v2/abc').resolves({ data: dummyData });
getStub.withArgs('/publication/v2/abc1').rejects(errorResponse);
getStub.withArgs('/publication/v2/abc2').rejects(errorMessage);

getStub.withArgs('/publication/abc/exists').resolves({ data: true });
getStub.withArgs('/publication/abc1/exists').rejects(errorResponse);
getStub.withArgs('/publication/abc2/exists').rejects(errorMessage);

getStub.withArgs('/publication/abc/sizes').resolves({ data: fileSizeData });
getStub.withArgs('/publication/abc1/sizes').rejects(errorResponse);
getStub.withArgs('/publication/abc2/sizes').rejects(errorMessage);

describe('Channel Management requests', () => {
    describe('Get stored file', () => {
        it('should return publication', async () => {
            expect(
                await channelManagementRequests.getStoredFile('abc', { 'x-user-id': userId, 'x-file-type': 'PDF' })
            ).toEqual(dummyData);
        });

        it('should return null if get fails', async () => {
            expect(
                await channelManagementRequests.getStoredFile('abc1', { 'x-user-id': userId, 'x-file-type': 'PDF' })
            ).toBeNull();
        });

        it('should return null if request fails', async () => {
            expect(
                await channelManagementRequests.getStoredFile('abc2', { 'x-user-id': userId, 'x-file-type': 'EXCEL' })
            ).toBeNull();
        });
    });

    describe('File exists', () => {
        it('should return true if file exists', async () => {
            expect(await channelManagementRequests.fileExists('abc')).toEqual(true);
        });

        it('should return false and an error response if get fails', async () => {
            expect(await channelManagementRequests.fileExists('abc1')).toEqual(false);
        });

        it('should return false and an error response if request fails', async () => {
            expect(await channelManagementRequests.fileExists('abc2')).toEqual(false);
        });
    });

    describe('Get file sizes', () => {
        it('should return true if file exists', async () => {
            expect(await channelManagementRequests.getFileSizes('abc')).toEqual(fileSizeData);
        });

        it('should return false and an error response if get fails', async () => {
            expect(await channelManagementRequests.getFileSizes('abc1')).toBeNull();
        });

        it('should return false and an error response if request fails', async () => {
            expect(await channelManagementRequests.getFileSizes('abc2')).toBeNull();
        });
    });
});
