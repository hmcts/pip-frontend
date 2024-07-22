import { dataManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { PublicationFileRequests } from '../../../main/resources/requests/PublicationFileRequests';
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

const publicationFileRequests = new PublicationFileRequests();

const getStub = sinon.stub(dataManagementApi, 'get');

getStub.withArgs('/publication/file/abc').resolves({ data: dummyData });
getStub.withArgs('/publication/file/abc1').rejects(errorResponse);
getStub.withArgs('/publication/file/abc2').rejects(errorMessage);

getStub.withArgs('/publication/abc/exists').resolves({ data: true });
getStub.withArgs('/publication/abc1/exists').rejects(errorResponse);
getStub.withArgs('/publication/abc2/exists').rejects(errorMessage);

getStub.withArgs('/publication/abc/sizes').resolves({ data: fileSizeData });
getStub.withArgs('/publication/abc1/sizes').rejects(errorResponse);
getStub.withArgs('/publication/abc2/sizes').rejects(errorMessage);

describe('Publication file requests', () => {
    describe('Get stored file', () => {
        it('should return publication', async () => {
            expect(
                await publicationFileRequests.getStoredFile('abc', 'PDF', { 'x-user-id': userId })
            ).toEqual(dummyData);
        });

        it('should return null if get fails', async () => {
            expect(
                await publicationFileRequests.getStoredFile('abc1', 'PDF', { 'x-user-id': userId })
            ).toBeNull();
        });

        it('should return null if request fails', async () => {
            expect(
                await publicationFileRequests.getStoredFile('abc2', 'EXCEL', { 'x-user-id': userId })
            ).toBeNull();
        });
    });

    describe('File exists', () => {
        it('should return true if file exists', async () => {
            expect(await publicationFileRequests.fileExists('abc')).toEqual(true);
        });

        it('should return false and an error response if get fails', async () => {
            expect(await publicationFileRequests.fileExists('abc1')).toEqual(false);
        });

        it('should return false and an error response if request fails', async () => {
            expect(await publicationFileRequests.fileExists('abc2')).toEqual(false);
        });
    });

    describe('Get file sizes', () => {
        it('should return true if file exists', async () => {
            expect(await publicationFileRequests.getFileSizes('abc')).toEqual(fileSizeData);
        });

        it('should return false and an error response if get fails', async () => {
            expect(await publicationFileRequests.getFileSizes('abc1')).toBeNull();
        });

        it('should return false and an error response if request fails', async () => {
            expect(await publicationFileRequests.getFileSizes('abc2')).toBeNull();
        });
    });
});
