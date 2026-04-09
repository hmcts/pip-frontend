import { cloneDeep } from 'lodash';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import { ThirdPartyService } from '../../../../main/service/ThirdPartyService';
import { Response } from 'express';
import ManageThirdPartySubscribersController from '../../../../main/controllers/system-admin/ManageThirdPartySubscribersController';

const manageThirdPartySubscribersController = new ManageThirdPartySubscribersController();

describe('Manage third-party subscribers Controller', () => {
    const i18n = {
        'manage-third-party-subscribers': {},
    };
    const request = mockRequest(i18n);
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    it('should render third-party subscribers page', async () => {
        const thirdPartySubscribersData = [
            {
                name: 'User Name',
                createdDate: '17th Nov 2022',
            },
        ];

        const getThirdPartySubscribersStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscribers');
        getThirdPartySubscribersStub.resolves(thirdPartySubscribersData);

        const options = {
            ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-third-party-subscribers']),
            thirdPartySubscribers: thirdPartySubscribersData,
        };

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('system-admin/manage-third-party-subscribers', options);

        await manageThirdPartySubscribersController.get(request, response);

        responseMock.verify();
    });
});
