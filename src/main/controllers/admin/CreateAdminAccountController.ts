import { cloneDeep } from 'lodash';
import { CreateAccountService } from '../../service/CreateAccountService';
import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';

const createAccountService = new CreateAccountService();
let formCookie;

export default class CreateAdminAccountController {
    public get(req: PipRequest, res: Response): void {
        formCookie = req.cookies['createAdminAccount'];
        const formData = formCookie ? JSON.parse(formCookie) : null;
        res.render('admin/create-admin-account', {
            formData,
            radios: createAccountService.buildRadiosList(formData?.['user-role']),
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-admin-account']),
        });
    }

    public post(req: PipRequest, res: Response): void {
        const formData = req.body;
        const formValidation = createAccountService.validateAdminFormFieldsWithRole(
            formData,
            req.lng,
            'create-admin-account'
        );
        const isValidForm = Object.values(formValidation).every(o => o.message === null);
        if (isValidForm) {
            formData.userRoleObject = createAccountService.getRoleByKey(formData['user-role']);
            res.cookie('createAdminAccount', JSON.stringify(formData), { secure: true });
            res.redirect('create-admin-account-summary');
        } else {
            res.render('admin/create-admin-account', {
                formData,
                radios: createAccountService.buildRadiosList(formData?.['user-role']),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-admin-account']),
                formErrors: formValidation,
            });
        }
    }
}
