import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import { Response } from 'express';
import { ThirdPartyService } from '../../../../main/service/ThirdPartyService';
import { cloneDeep } from 'lodash';
import ManageThirdPartySubscribersViewController from '../../../../main/controllers/system-admin/ManageThirdPartySubscribersViewController';

const manageThirdPartySubscribersViewController = new ManageThirdPartySubscribersViewController();

describe('Manage third party subscribers view Controller', () => {
    const i18n = {
        'manage-third-party-subscribers': {},
        error: {},
    };
    const request = mockRequest(i18n);
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    const getThirdPartyByUserIdStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriberById');

    const userId = '1234-1234';

    it('should render third party subscribers page', async () => {
        const mockUser = { userId: userId };
        request['query'] = { userId: userId };

        getThirdPartyByUserIdStub.withArgs(userId).resolves(mockUser);

        const options = {
            ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-third-party-subscribers-view']),
            userDetails: mockUser,
        };

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('system-admin/manage-third-party-subscribers-view', options);

        await manageThirdPartySubscribersViewController.get(request, response);
        responseMock.verify();
    });

    it('should render third party subscribers page when more than one sub', async () => {
        const mockUser = { userId: userId };

        request['query'] = { userId: userId };

        getThirdPartyByUserIdStub.withArgs(userId).resolves(mockUser);

        const options = {
            ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-third-party-subscribers-view']),
            userDetails: mockUser,
        };

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('system-admin/manage-third-party-subscribers-view', options);

        await manageThirdPartySubscribersViewController.get(request, response);
        responseMock.verify();
    });

    it('should render error page if no user supplied', async () => {
        request['query'] = {};

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

        await manageThirdPartySubscribersViewController.get(request, response);

        responseMock.verify();
    });

    it('should render error page if no user can be found', async () => {
        request['query'] = { userId: userId };

        getThirdPartyByUserIdStub.withArgs(userId).resolves(null);

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

        await manageThirdPartySubscribersViewController.get(request, response);

        responseMock.verify();
    });
});
