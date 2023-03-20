import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { CreateAccountService } from '../service/createAccountService';
import { UserManagementService } from '../service/userManagementService';

const createAccountService = new CreateAccountService();
const userManagementService = new UserManagementService();

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
                await userManagementService.auditAction(
                    req.user,
                    'ATTEMPT_SYSTEM_ADMIN_CREATION',
                    'Attempted to create system admin account for: ' + formData['emailAddress']
                );
                res.render('create-system-admin-account-summary', {
                    formData,
                    displayError: true,
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-system-admin-account-summary']),
                });
            } else {
                await userManagementService.auditAction(
                    req.user,
                    'SYSTEM_ADMIN_CREATION',
                    'System admin account created for: ' + formData['emailAddress']
                );
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
