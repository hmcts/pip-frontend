import { cloneDeep } from 'lodash';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import { ThirdPartyService } from '../../../main/service/thirdPartyService';
import { Response } from 'express';
import ManageThirdPartyUsersController from '../../../main/controllers/ManageThirdPartyUsersController';

const manageThirdPartyUsersController = new ManageThirdPartyUsersController();

describe('Manage third party users Controller', () => {
    const i18n = { 'manage-third-party-users': {} };
    const request = mockRequest(i18n);
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    it('should render third party users page', async () => {
        const thirdPartyData = [
            {
                provenanceUserId: 'User Name',
                roles: 'This is a role',
                createdDate: '17th Nov 2022',
            },
        ];

        const getThirdPartyAccountsStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartyAccounts');
        getThirdPartyAccountsStub.resolves(thirdPartyData);

        const options = {
            ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-third-party-users']),
            thirdPartyAccounts: thirdPartyData,
        };

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('manage-third-party-users', options);

        await manageThirdPartyUsersController.get(request, response);

        responseMock.verify();
    });
});
