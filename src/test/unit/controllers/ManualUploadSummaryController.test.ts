import { cloneDeep } from 'lodash';
import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import ManualUploadSummaryController from '../../../main/controllers/ManualUploadSummaryController';
import { ManualUploadService } from '../../../main/service/manualUploadService';
import { FileHandlingService } from '../../../main/service/fileHandlingService';

const mockData = {foo: 'blah', listType: 'SJP_PUBLIC_LIST', listTypeName: 'SJP Public List', language: 'English', languageName: 'English'};
const manualUploadSummaryController = new ManualUploadSummaryController();
const uploadStub = sinon.stub(ManualUploadService.prototype, 'uploadPublication');
sinon.stub(ManualUploadService.prototype, 'formatPublicationDates').returns(mockData);
sinon.stub(FileHandlingService.prototype, 'readFile').returns('');
sinon.stub(FileHandlingService.prototype, 'removeFile').returns('');
uploadStub.withArgs({ ...mockData, file: '', userId: '1'}, true).resolves(false);

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

    it('should redirect to success page', async () => {
      const req = mockRequest(i18n);
      const res = { render: () => {return '';}, redirect: () => '', clearCookie: () => {return '';}} as unknown as Response;
      req.user = {id: '2'};
      req['cookies'] = {'formCookie': JSON.stringify(mockData)};
      const responseMock = sinon.mock(res);

      uploadStub.withArgs({ ...mockData, file: '', userId: '2'}, true).resolves(res);

      responseMock.expects('redirect').once().withArgs('upload-confirmation');

      await manualUploadSummaryController.post(req, res);
      responseMock.verify();
    });
  });
});
