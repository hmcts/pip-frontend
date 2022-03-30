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
const mockUploadFileBody = {file: '', fileName: ''};
const mockUploadFileHeaders = {'foo': 'bar'};
const fileUploadAPI = new DataManagementRequests();

describe('Data Management requests', () => {
  describe('upload publication', () => {
    beforeEach(() => {
      sinon.restore();
    });

    it('should return true on success', async () => {
      // chain call for superagent post.set.set.attach
      sinon.stub(superagent, 'post').callsFake(() => {
        return {
          set(): any {
            return { set(): any {
              return { attach: sinon.stub().returns(true) };
            } };
          },
        };
      });
      expect(await fileUploadAPI.uploadPublication(mockUploadFileBody, mockUploadFileHeaders)).toBe(true);
    });

    it('should return error response', async () => {
      sinon.stub(superagent, 'post').withArgs({file: '', fileName: 'foo'}, mockUploadFileHeaders).resolves(Promise.reject(errorResponse));
      expect(await fileUploadAPI.uploadPublication({file: '', fileName: 'foo'}, mockUploadFileHeaders)).toBe(false);
    });

    it('should return error request', async () => {
      sinon.stub(superagent, 'post').withArgs({file: '', fileName: 'bar'}, mockUploadFileHeaders).resolves(Promise.reject(errorRequest));
      expect(await fileUploadAPI.uploadPublication({file: '', fileName: 'bar'}, mockUploadFileHeaders)).toBe(false);
    });

    it('should return error message', async () => {
      sinon.stub(superagent, 'post').withArgs({file: '', fileName: 'baz'}, mockUploadFileHeaders).resolves(Promise.reject(errorMessage));
      expect(await fileUploadAPI.uploadPublication({file: '', fileName: 'baz'}, mockUploadFileHeaders)).toBe(false);
    });
  });

  describe('upload json publication', () => {
    it('should return true on success', async () => {
      sinon.restore();
      sinon.stub(dataManagementApi, 'post').withArgs('/publication',{file: ''}, {}).resolves(true);
      expect(await fileUploadAPI.uploadJSONPublication({}, {})).toBe(true);
    });

    it('should return error response', async () => {
      sinon.restore();
      sinon.stub(dataManagementApi, 'post').withArgs('/publication').resolves(Promise.reject(errorResponse));
      expect(await fileUploadAPI.uploadJSONPublication({file: 'foo'}, {headers: {}})).toBe(false);
    });

    it('should return error request', async () => {
      sinon.restore();
      sinon.stub(dataManagementApi, 'post').withArgs('/publication').resolves(Promise.reject(errorRequest));
      expect(await fileUploadAPI.uploadJSONPublication({file: 'bar'}, {headers: {}})).toBe(false);
    });

    it('should return error message', async () => {
      sinon.restore();
      sinon.stub(dataManagementApi, 'post').withArgs('/publication').resolves(Promise.reject(errorMessage));
      expect(await fileUploadAPI.uploadJSONPublication({file: 'baz'}, {headers: {}})).toBe(false);
    });
  });
});
