import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { CreateAccountService } from '../service/createAccountService';
import { UserManagementService } from '../service/userManagementService';
import { formattedRoles } from '../models/consts';

const createAccountService = new CreateAccountService();
const userManagementService = new UserManagementService();

export default class CreateAdminAccountSummaryController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.createAdminAccount ? JSON.parse(req.cookies['createAdminAccount']) : {};
        res.render('create-admin-account-summary', {
            formData,
            accountCreated: false,
            displayError: false,
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-admin-account-summary']),
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.createAdminAccount ? JSON.parse(req.cookies['createAdminAccount']) : {};
        const response = await createAccountService.createAdminAccount(formData, req.user['userId']);

        if (response) {
            const roleName = formattedRoles[formData.userRoleObject.mapping];
            await userManagementService.auditAction(
                req.user,
                'ADMIN_CREATION',
                `${roleName} account created for: ${formData.emailAddress}`
            );

            res.cookie('createAdminAccount', '');
        }

        res.render('create-admin-account-summary', {
            formData,
            accountCreated: response,
            displayError: !response,
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-admin-account-summary']),
        });
    }
}
