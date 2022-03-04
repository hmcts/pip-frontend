import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import RemoveListConfirmationController from '../../../main/controllers/RemoveListConfirmationController';
import { PublicationService } from '../../../main/service/publicationService';

const i18n = {
  'remove-list-confirmation': {},
  error: {},
};
const removeListConfirmationController = new RemoveListConfirmationController();
const response = { render: () => {return '';}, redirect: () => {return '';}} as unknown as Response;
const request = mockRequest(i18n);

const removePublicationStub = sinon.stub(PublicationService.prototype, 'removePublication');
removePublicationStub.withArgs('valid-artefact').resolves(true);
removePublicationStub.withArgs('foo').resolves(false);

describe('Remove List Confirmation Controller', () => {
  it('should render remove list confirmation page', async () => {
    request.query = {artefact: 'valid-artefact', court: '5'};
    const responseMock = sinon.mock(response);
    const expectedOptions = {
      ...i18n['remove-list-confirmation'],
      artefactId: 'valid-artefact',
      courtId: '5',
      displayError: false,
    };

    responseMock.expects('render').once().withArgs('remove-list-confirmation', expectedOptions);
    await removeListConfirmationController.get(request, response);
    await responseMock.verify();
  });

  it('should render error page if artefact query param is not provided', async () => {
    request.query = {court: '5'};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', {...i18n.error});
    await removeListConfirmationController.get(request, response);
    await responseMock.verify();
  });

  it('should render error page if court query param is not provided', async () => {
    request.query = {artefact: 'true'};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', {...i18n.error});
    await removeListConfirmationController.get(request, response);
    await responseMock.verify();
  });

  it('should redirect to remove list success page if remove choice is yes', async () => {
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);
    request.body = {
      'remove-choice': 'yes',
      artefactId: 'valid-artefact',
    };

    responseMock.expects('redirect').once().withArgs('/remove-list-success');
    await removeListConfirmationController.post(request, response);
    await responseMock.verify();
  });

  it('should render error if remove choice is yes and request fails', async () => {
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);
    request.body = {
      'remove-choice': 'yes',
      artefactId: 'foo',
    };

    responseMock.expects('render').once().withArgs('error', {...i18n.error});
    await removeListConfirmationController.post(request, response);
    await responseMock.verify();
  });

  it('should redirect to remove list summary if choice is no', async () => {
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);
    request.body = {
      'remove-choice': 'no',
      courtId: '5',
    };

    responseMock.expects('redirect').once().withArgs('/remove-list-search-results?courtId=5');
    await removeListConfirmationController.post(request, response);
    await responseMock.verify();
  });

  it('should render remove list confirmation with error if there is no choice', async () => {
    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);
    request.body = {
      courtId: '5',
      artefactId: 'foo',
    };
    const expectedOptions = {
      ...i18n['remove-list-confirmation'],
      ...request.body,
      displayError: true,
    };

    responseMock.expects('render').once().withArgs('remove-list-confirmation', expectedOptions);
    await removeListConfirmationController.post(request, response);
    await responseMock.verify();
  });
});
