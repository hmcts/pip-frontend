import { cloneDeep } from 'lodash';
import { CreateAccountService } from '../service/createAccountService';
import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

const createAccountService = new CreateAccountService();
let formCookie;

export default class CreateSystemAdminAccountController {
    public get(req: PipRequest, res: Response): void {
        formCookie = req.cookies['createAdminAccount'];
        const formData = formCookie ? JSON.parse(formCookie) : null;
        res.render('create-system-admin-account', {
            formData,
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-system-admin-account']),
        });
    }

    public post(req: PipRequest, res: Response): void {
        const formData = req.body;
        const formValidation = createAccountService.validateAdminFormFields(
            formData,
            req.lng,
            'create-system-admin-account'
        );
        const isValidForm = Object.values(formValidation).every(o => o.message === null);
        if (isValidForm) {
            res.cookie('createAdminAccount', JSON.stringify(formData));
            res.redirect('create-system-admin-account-summary');
        } else {
            res.render('create-system-admin-account', {
                formData,
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-system-admin-account']),
                formErrors: formValidation,
            });
        }
    }
}
