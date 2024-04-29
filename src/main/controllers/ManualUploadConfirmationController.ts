import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class ManualUploadConfirmationController {
    public get(req: PipRequest, res: Response): void {
        res.render('manual-upload-confirmation', req.i18n.getDataByLanguage(req.lng)['manual-upload-confirmation']);
    }
}
