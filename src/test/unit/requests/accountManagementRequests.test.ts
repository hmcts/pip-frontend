import sinon from 'sinon';
import {AccountManagementRequests} from '../../../main/resources/requests/accountManagementRequests';

const application = {
  body: {
    applicationId: 930,
    employer: 'MOJ',
    email: 'boo@bar.com',
    status: 'Pending',
  },
};

const errorResponse = {
  response: {
    body: 'test error',
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
const superagent = require('superagent');
describe('Account Management requests', () => {
  describe('upload publication', () => {
    beforeEach(() => {
      sinon.restore();
    });

    it('should return reference on success', async () => {

      sinon.stub(superagent, 'post').callsFake(() => {
        return {
          set(): any {
            return {
              set(): any {
                return {attach: sinon.stub().returns(application)};
              },
            };
          },
        };
      });

      return await fileUploadAPI.uploadNewAccountRequest(mockUploadFileBody, mockUploadFileHeaders).then(data => {
        expect(data).toBe(application.body);
      });
    });

    it('should return error response', async () => {
      sinon.stub(superagent, 'post').withArgs({
        file: '',
        fileName: 'foo',
      }, mockUploadFileHeaders).resolves(Promise.reject(errorResponse));
      return await fileUploadAPI.uploadNewAccountRequest({
        file: '',
        fileName: 'foo',
      }, mockUploadFileHeaders).then(data => {
        expect(data).toBe(null);
      });
    });

    it('should return error request', async () => {
      sinon.stub(superagent, 'post').withArgs({
        file: '',
        fileName: 'bar',
      }, mockUploadFileHeaders).resolves(Promise.reject(errorRequest));
      return await fileUploadAPI.uploadNewAccountRequest({
        file: '',
        fileName: 'bar',
      }, mockUploadFileHeaders).then(data => {
        expect(data).toBe(null);
      });
    });

    it('should return error message', async () => {
      sinon.stub(superagent, 'post').withArgs({
        file: '',
        fileName: 'baz',
      }, mockUploadFileHeaders).resolves(Promise.reject(errorMessage));
      return await fileUploadAPI.uploadNewAccountRequest({
        file: '',
        fileName: 'baz',
      }, mockUploadFileHeaders).then(data => {
        expect(data).toBe(null);
      });
    });
  });
});
