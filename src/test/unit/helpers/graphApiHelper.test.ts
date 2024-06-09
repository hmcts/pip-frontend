import { graphApi } from '../../../main/resources/requests/utils/axiosConfig';
import sinon from 'sinon';
import { getSsoUserGroups } from '../../../main/helpers/graphApiHelper';

const errorResponse = {
    response: {
        data: 'test error',
    },
};
const errorMessage = {
    message: 'test',
};

const oid = '123';
const accessToken = '456';

describe('Graph API helper', () => {
    const postStub = sinon.stub(graphApi, 'post');

    describe('Create Azure Account', () => {
        it('should return the response value on success', async () => {
            postStub.resolves({ data: { status: 'success' } });
            const response = await getSsoUserGroups(oid, accessToken);
            expect(response).toStrictEqual({ status: 'success' });
        });

        it('should return null on error response', async () => {
            postStub.resolves(Promise.reject(errorResponse));
            const response = await getSsoUserGroups(oid, accessToken);
            expect(response).toBe(null);
        });

        it('should return null on error message', async () => {
            postStub.resolves(Promise.reject(errorMessage));
            const response = await getSsoUserGroups(oid, accessToken);
            expect(response).toBe(null);
        });
    });
});
