import sinon from 'sinon';
import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';
import {ManualUploadService} from '../../../main/service/manualUploadService';
import ManualUploadController from '../../../main/controllers/ManualUploadController';

const manualUploadController = new ManualUploadController();
describe('Manual Upload Controller', () => {
  const i18n = {
    'manual-upload': {},
  };
  const response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);
  describe('GET', () => {
    sinon.stub(ManualUploadService.prototype, 'buildFormData').resolves({});
    it('should render the manual-upload page', async () =>  {
      const responseMock = sinon.mock(response);
      const expectedData = {
        ...i18n['manual-upload'],
        listItems: {},
      };

      responseMock.expects('render').once().withArgs('manual-upload', expectedData);

      await manualUploadController.get(request, response);
      responseMock.verify();
    });
  });
});
