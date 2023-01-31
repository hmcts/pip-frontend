import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class ManualReferenceDataUploadConfirmationController {
    public get(req: PipRequest, res: Response): void {
        res.render(
            'manual-reference-data-upload-confirmation',
            req.i18n.getDataByLanguage(req.lng)['manual-reference-data-upload-confirmation']
        );
    }
}
