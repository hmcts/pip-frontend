import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { CreateAccountService } from '../service/createAccountService';

const createAccountService = new CreateAccountService();

export default class CreateSystemAdminAccountSummaryController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.createAdminAccount ? JSON.parse(req.cookies['createAdminAccount']) : {};
        res.render('create-system-admin-account-summary', {
            formData,
            accountCreated: false,
            displayError: false,
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-system-admin-account-summary']),
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.createAdminAccount ? JSON.parse(req.cookies['createAdminAccount']) : {};

        formData['userRoleObject'] = { mapping: 'SYSTEM_ADMIN' };

        const response = await createAccountService.createSystemAdminAccount(formData, req.user?.['userId']);
        if (response) {
            if (response['error'] && !response['duplicate'] && !response['aboveMaxSystemAdmin']) {
                res.render('create-system-admin-account-summary', {
                    formData,
                    displayError: true,
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-system-admin-account-summary']),
                });
            } else {
                res.cookie('createAdminAccount', '');
                res.render('create-system-admin-account-confirm', {
                    formData,
                    accountCreated: !response['error'] && !response['duplicate'] && !response['aboveMaxSystemAdmin'],
                    isDuplicateError: response['duplicate'],
                    isAboveMaxError: response['aboveMaxSystemAdmin'],
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-system-admin-account-confirm']),
                });
            }
        }
    }
}
