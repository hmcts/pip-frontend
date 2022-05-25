import MediaAccountApprovalController from '../../../main/controllers/MediaAccountApprovalController';
import {Response} from 'express';
import sinon from 'sinon';
import {mockRequest} from '../mocks/mockRequest';
import {MediaAccountApplicationService} from '../../../main/service/mediaAccountApplicationService';
import {cloneDeep} from 'lodash';
import {dummyApplication} from '../../helpers/testConsts';

const i18n = {'media-account-approval': {}, 'media-account-approval-confirmation': {}, 'error': {}};
const mediaAccountApplicationStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus');
const mediaAccountCreationStub = sinon.stub(MediaAccountApplicationService.prototype, 'createAccountFromApplication');

describe('Media Account Approval Controller', () => {

  const applicantId = '1234';
  const status = 'PENDING';
  const email = 'a@b.com';

  const mediaAccountApprovalController = new MediaAccountApprovalController();
  const response = { redirect: () => {return '';}, render: () => {return '';}, send: () => {return '';}, set: () => {return '';}} as unknown as Response;

  it('should render media-account-approval page when applicant ID sent and found', async () => {
    const responseMock = sinon.mock(response);

    const request = mockRequest(i18n);
    request['query'] = {'applicantId': applicantId};

    mediaAccountApplicationStub.withArgs(applicantId, status).resolves(dummyApplication);

    responseMock.expects('render').once().withArgs('media-account-approval',
      {...cloneDeep(request.i18n.getDataByLanguage(request.lng)['media-account-approval']),
        applicantData: dummyApplication });

    await mediaAccountApprovalController.get(request, response);

    responseMock.verify();
  });

  it('should render error page when applicant not found', async () => {
    const responseMock = sinon.mock(response);

    const request = mockRequest(i18n);
    request['query'] = {'applicantId': '1234'};

    mediaAccountApplicationStub.withArgs('1234', status).resolves(null);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

    await mediaAccountApprovalController.get(request, response);

    responseMock.verify();
  });

  it('should render media-account-approval-confirmation page if applicant found, approved, and successfully updated', async () => {
    const responseMock = sinon.mock(response);

    const request = mockRequest(i18n);
    request['body'] = {'approved': 'Yes', 'applicantId': applicantId};
    request['user'] = {'emails': [email] };

    mediaAccountApplicationStub.withArgs(applicantId, status).resolves(dummyApplication);
    mediaAccountCreationStub.withArgs(applicantId, email).resolves(true);

    responseMock.expects('render').once().withArgs('media-account-approval-confirmation',
      {...cloneDeep(request.i18n.getDataByLanguage(request.lng)['media-account-approval-confirmation']),
        applicantData: dummyApplication });

    await mediaAccountApprovalController.post(request, response);

    responseMock.verify();
  });

  it('should render error page if no applicant is found', async () => {
    const responseMock = sinon.mock(response);

    const request = mockRequest(i18n);
    request['body'] = {'approved': 'Yes', 'applicantId': '1234'};
    request['user'] = {'emails': [email] };

    mediaAccountApplicationStub.withArgs('1234', status).resolves(null);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

    await mediaAccountApprovalController.post(request, response);

    responseMock.verify();
  });

  it('should render approval page if applicant id found, but no radio button has been selected', async () => {
    const responseMock = sinon.mock(response);

    const request = mockRequest(i18n);
    request['body'] = {'applicantId': applicantId};
    request['user'] = {'emails': [email] };

    mediaAccountApplicationStub.withArgs(applicantId, status).resolves(dummyApplication);

    responseMock.expects('render').once().withArgs('media-account-approval',
      {...cloneDeep(request.i18n.getDataByLanguage(request.lng)['media-account-approval']),
        applicantData: dummyApplication,
        displayRadioError: true});

    await mediaAccountApprovalController.post(request, response);

    responseMock.verify();
  });

  it('should render media-account-review page if No approval is given', async () => {
    const responseMock = sinon.mock(response);

    const request = mockRequest(i18n);
    request['body'] = {'approved': 'No', 'applicantId': applicantId};
    request['user'] = {'emails': [email] };

    mediaAccountApplicationStub.withArgs(applicantId, status).resolves(dummyApplication);

    responseMock.expects('redirect').once().withArgs('/media-account-review?applicantId=' + applicantId);

    await mediaAccountApprovalController.post(request, response);

    responseMock.verify();
  });

  it('should render media-account-approval page with error if failed to update application when approval is given', async () => {
    const responseMock = sinon.mock(response);

    const request = mockRequest(i18n);
    request['body'] = {'approved': 'Yes', 'applicantId': applicantId};
    request['user'] = {'emails': [email] };

    mediaAccountApplicationStub.withArgs(applicantId, status).resolves(dummyApplication);
    mediaAccountCreationStub.withArgs(applicantId, email).resolves(false);

    responseMock.expects('render').once().withArgs('media-account-approval',
      {...cloneDeep(request.i18n.getDataByLanguage(request.lng)['media-account-approval']),
        applicantData: dummyApplication,
        displayAzureError: true});

    await mediaAccountApprovalController.post(request, response);

    responseMock.verify();
  });

});
