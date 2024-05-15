import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../service/ThirdPartyService';
import {UserManagementService} from "../service/UserManagementService";

const thirdPartyService = new ThirdPartyService();
const userManagementService = new UserManagementService();

export default class CreateThirdPartyUserSummaryController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        res.render('create-third-party-user-summary', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-third-party-user-summary']),
            formData,
            displayError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        const response = await thirdPartyService.createThirdPartyUser(formData, req.user['userId']);

        if (response) {
            await userManagementService.auditAction(
                req.user,
                'THIRD_PARTY_USER_CREATION',
                `Third party user created for: ${formData.thirdPartyName}`
            );
            res.redirect('/create-third-party-user-success');
        } else {
            res.render('create-third-party-user-summary', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-third-party-user-summary']),
                formData,
                displayError: true,
            });
        }
    }
}
