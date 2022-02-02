import { DataManagementRequests } from '../../../main/resources/requests/dataManagementRequests';
import { dataManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import sinon from 'sinon';

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
const superagent = require('superagent');
// const mockUploadFileBody = {file: '', fileName: ''};
const mockUploadFileHeaders = {};
const fileUploadAPI = new DataManagementRequests();
const superAgentStub = sinon.stub(superagent, 'post');
const dataManagementStub = sinon.stub(dataManagementApi, 'post');

describe('Data Management requests', () => {
  describe('upload publication', () => {
    // it('should return true on success', async () => {
    //   superAgentStub.withArgs(mockUploadFileBody, mockUploadFileHeaders).resolves(true);
    //   expect(await fileUploadAPI.uploadPublication(mockUploadFileBody, mockUploadFileHeaders)).toBe(true);
    // });

    it('should return error response', async () => {
      superAgentStub.withArgs({file: '', fileName: 'foo'}, mockUploadFileHeaders).resolves(Promise.reject(errorResponse));
      expect(await fileUploadAPI.uploadPublication({file: '', fileName: 'foo'}, mockUploadFileHeaders)).toBe(false);
    });

    it('should return error request', async () => {
      superAgentStub.withArgs({file: '', fileName: 'bar'}, mockUploadFileHeaders).resolves(Promise.reject(errorRequest));
      expect(await fileUploadAPI.uploadPublication({file: '', fileName: 'bar'}, mockUploadFileHeaders)).toBe(false);
    });

    it('should return error message', async () => {
      superAgentStub.withArgs({file: '', fileName: 'baz'}, mockUploadFileHeaders).resolves(Promise.reject(errorMessage));
      expect(await fileUploadAPI.uploadPublication({file: '', fileName: 'baz'}, mockUploadFileHeaders)).toBe(false);
    });
  });

  describe('upload json publication', () => {
    it('should return true on success', async () => {
      dataManagementStub.withArgs('/publication', {}, {}).resolves(true);
      expect(await fileUploadAPI.uploadJSONPublication({}, {})).toBe(true);
    });

    it('should return error response', async () => {
      dataManagementStub.withArgs('/publication', {file: 'foo'}, {}).resolves(Promise.reject(errorResponse));
      expect(await fileUploadAPI.uploadJSONPublication({file: 'foo'}, {})).toBe(false);
    });

    it('should return error request', async () => {
      dataManagementStub.withArgs('/publication', {file: 'bar'}, {}).resolves(Promise.reject(errorRequest));
      expect(await fileUploadAPI.uploadJSONPublication({file: 'bar'}, {})).toBe(false);
    });

    it('should return error request', async () => {
      dataManagementStub.withArgs('/publication', {file: 'baz'}, {}).resolves(Promise.reject(errorMessage));
      expect(await fileUploadAPI.uploadJSONPublication({file: 'baz'}, {})).toBe(false);
    });
  });
});
