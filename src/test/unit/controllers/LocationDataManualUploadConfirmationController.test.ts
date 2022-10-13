import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import LocationDataManualUploadConfirmationController
  from "../../../main/controllers/LocationDataManualUploadConfirmationController";

const locationDataManualUploadConfirmationController = new LocationDataManualUploadConfirmationController();

describe('Location data file upload Confirmation Controller', () => {
  it('should render confirmation page', async () => {
    const i18n = {'location-data-upload-confirmation': {}};
    const response = { render: () => {return '';} } as unknown as Response;
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('location-data-upload-confirmation', {...i18n['location-data-upload-confirmation']});

    await locationDataManualUploadConfirmationController.get(request, response);
    responseMock.verify();
  });
});
