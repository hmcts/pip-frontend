import { cloneDeep } from 'lodash';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import { Response } from 'express';
import ManageListTypesController from '../../../../main/controllers/system-admin/ManageListTypesController';
import { PublicationService } from '../../../../main/service/PublicationService';

const manageListTypesController = new ManageListTypesController();

describe('Manage List Types Controller', () => {
    const i18n = {
        'manage-list-types': {},
    };
    const request = mockRequest(i18n);
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    afterEach(() => {
        sinon.restore();
    });

    it('should render manage list types page with only non-hidden list types', () => {
        const listTypeMap = new Map([
            ['SJP_PUBLIC_LIST', { friendlyName: 'SJP Public List', isHidden: false }],
            ['CIVIL_DAILY_CAUSE_LIST', { friendlyName: 'Civil Daily Cause List', isHidden: true }],
            ['FAMILY_DAILY_CAUSE_LIST', { friendlyName: 'Family Daily Cause List', isHidden: false }],
        ]);

        sinon.stub(PublicationService.prototype, 'getListTypes').returns(listTypeMap as any);

        const responseMock = sinon.mock(response);
        responseMock
            .expects('render')
            .once()
            .withArgs('system-admin/manage-list-types', {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-list-types']),
                listTypes: [
                    { id: 'FAMILY_DAILY_CAUSE_LIST', name: 'Family Daily Cause List' },
                    { id: 'SJP_PUBLIC_LIST', name: 'SJP Public List' },
                ],
            });

        manageListTypesController.get(request, response);
        responseMock.verify();
    });

    it('should render manage list types page with empty list when no list types exist', () => {
        sinon.stub(PublicationService.prototype, 'getListTypes').returns(new Map() as any);

        const responseMock = sinon.mock(response);
        responseMock
            .expects('render')
            .once()
            .withArgs('system-admin/manage-list-types', {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['manage-list-types']),
                listTypes: [],
            });

        manageListTypesController.get(request, response);
        responseMock.verify();
    });
});
