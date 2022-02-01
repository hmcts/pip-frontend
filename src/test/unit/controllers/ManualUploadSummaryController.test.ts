import { cloneDeep } from 'lodash';
import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import { AdminService } from '../../../main/service/adminService';
import ManualUploadSummaryController from '../../../main/controllers/ManualUploadSummaryController';

const mockData = {foo: 'blah'};
const manualUploadSummaryController = new ManualUploadSummaryController();
const uploadStub = sinon.stub(AdminService.prototype, 'uploadPublication');
sinon.stub(AdminService.prototype, 'formatPublicationDates').returns(mockData);
sinon.stub(AdminService.prototype, 'readFile').returns('');
sinon.stub(AdminService.prototype, 'removeFile').returns('');
uploadStub.withArgs({ mockData, file: '', userId: '1'}, true).resolves(false);
uploadStub.withArgs({ mockData, file: '', userId: '2'}, true).resolves(true);

describe('Manual upload summary controller', () => {
  const i18n = {'file-upload-summary': {}};
  const request = mockRequest(i18n);
  const response = { render: () => {return '';}} as unknown as Response;
  request['cookies'] = {'formCookie': JSON.stringify(mockData)};

  describe('GET view' , () => {
    it('should render manual upload summary page', async () => {
      request.user = {id: '1'};
      const options = {
        ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['file-upload-summary']),
        fileUploadData: mockData,
        displayError: false,
      };
      const responseMock = sinon.mock(response);
      responseMock.expects('render').once().withArgs('file-upload-summary', options);

      await manualUploadSummaryController.get(request, response);
      responseMock.verify();
    });

    it('should render manual upload summary page with error query param', async () => {
      request.query = {error: 'true'};
      request.user = {id: '1'};
      const options = {
        ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['file-upload-summary']),
        fileUploadData: mockData,
        displayError: true,
      };
      const responseMock = sinon.mock(response);
      responseMock.expects('render').once().withArgs('file-upload-summary', options);

      await manualUploadSummaryController.get(request, response);
      responseMock.verify();
    });
  });

  describe('POST view' , () => {
    it('should render manual upload summary page with error', async () => {
      request.user = {id: '1'};
      const options = {
        ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['file-upload-summary']),
        fileUploadData: mockData,
        displayError: true,
      };
      const responseMock = sinon.mock(response);
      responseMock.expects('render').once().withArgs('file-upload-summary', options);

      await manualUploadSummaryController.post(request, response);
      responseMock.verify();
    });

    it('should render manual upload summary page with query params', async () => {
      request.query = {check: 'true'};
      const options = {
        ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['file-upload-summary']),
        fileUploadData: mockData,
        displayError: false,
      };
      const responseMock = sinon.mock(response);
      responseMock.expects('render').once().withArgs('file-upload-summary', options);

      await manualUploadSummaryController.post(request, response);
      responseMock.verify();
    });
  });
});
