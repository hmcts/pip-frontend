import sinon from 'sinon';
import {AccountManagementRequests} from '../../../main/resources/requests/accountManagementRequests';
import {accountManagementApi} from '../../../main/resources/requests/utils/axiosConfig';

const errorResponse = {
  response: {
    data: 'test error',
  },
};
const errorRequest = {
  request: 'test error',
};
const errorMessage = {
  message: 'test',
};
const mockUploadFileBody = {file: '', fileName: ''};
const mockUploadFileHeaders = {'foo': 'bar', 'Content-Type': 'multipart/form-data'};
const fileUploadAPI = new AccountManagementRequests();

describe('Account Management requests', () => {
  describe('upload publication', () => {
    beforeEach(() => {
      sinon.restore();
    });

    it('should return reference on success', async () => {

      const stub = sinon.stub(accountManagementApi, 'post');
      stub.withArgs('/account/create').resolves({data: 'ABCD1234'});

      return await fileUploadAPI.uploadNewAccountRequest(mockUploadFileBody, mockUploadFileHeaders).then(data => {
        expect(data).toBe('ABCD1234');
      });
    });

    it('should return error response', async () => {
      const stub = sinon.stub(accountManagementApi, 'post');
      stub.withArgs('/account/create').resolves(Promise.reject(errorResponse));
      return await fileUploadAPI.uploadNewAccountRequest({file: '', fileName: 'foo'}, mockUploadFileHeaders).then(data => {
        expect(data).toBe(null);
      });
    });

    it('should return error request', async () => {
      const stub = sinon.stub(accountManagementApi, 'post');
      stub.withArgs('/account/create').resolves(Promise.reject(errorRequest));
      return await fileUploadAPI.uploadNewAccountRequest({file: '', fileName: 'bar'}, mockUploadFileHeaders).then(data => {
        expect(data).toBe(null);
      });
    });

    it('should return error message', async () => {
      const stub = sinon.stub(accountManagementApi, 'post');
      stub.withArgs('/account/create').resolves(Promise.reject(errorMessage));
      return await fileUploadAPI.uploadNewAccountRequest({file: '', fileName: 'baz'}, mockUploadFileHeaders).then(data => {
        expect(data).toBe(null);
      });
    });
  });
});
