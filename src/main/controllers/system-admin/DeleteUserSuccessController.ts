import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';

export default class DeleteUserSuccessController {
    public get(req: PipRequest, res: Response): void {
        res.render('system-admin/delete-user-success', {
            ...req.i18n.getDataByLanguage(req.lng)['delete-user-success'],
        });
    }
}
