import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { MediaAccountApplicationService } from '../../service/MediaAccountApplicationService';
import { cloneDeep } from 'lodash';

const mediaAccountApplicationService = new MediaAccountApplicationService();

export default class MediaAccountRejectionConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        if (req.body?.applicantId) {
            const applicantData = await mediaAccountApplicationService.getApplicationById(req.body.applicantId);
            const reasons = req.body.reasons;
            return res.render('admin/media-account-rejection-confirmation', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['admin']['media-account-rejection-confirmation']),
                applicantData: applicantData,
                reasons: reasons,
            });
        }
        return res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
}
