import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class ManualUploadConfirmationController {
    public get(req: PipRequest, res: Response): void {
        const nonStrategicUpload = req.query?.['non-strategic'] === 'true';

        res.render('admin/manual-upload-confirmation', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-upload-confirmation']),
            nonStrategicUpload,
        });
    }
}
