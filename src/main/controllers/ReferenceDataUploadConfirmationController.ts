import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class ReferenceDataUploadConfirmationController {
    public get(req: PipRequest, res: Response): void {
        res.render(
            'reference-data-upload-confirmation',
            req.i18n.getDataByLanguage(req.lng)['reference-data-upload-confirmation']
        );
    }
}
