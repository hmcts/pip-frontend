import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { allAdminRoles, checkRoles } from '../authentication/authenticationHelper';

export default class SessionExpiringController {
    public get(req: PipRequest, res: Response): void {
        let redirectPage;
        if (req.user['userProvenance'] === 'PI_AAD') {
            redirectPage = checkRoles(req, allAdminRoles) ? 'ADMIN' : 'AAD';
        } else {
            redirectPage = 'CFT';
        }

        res.render('session-expiring', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['session-expiring']),
            gotoPage: req.query.currentPath,
            redirectPage: redirectPage,
        });
    }
}
