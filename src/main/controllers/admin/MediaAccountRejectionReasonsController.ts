import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import validator from 'validator';
import { MediaAccountApplicationService } from '../../service/MediaAccountApplicationService';

const mediaAccountApplicationService = new MediaAccountApplicationService();
import rejectReasons from '../../resources/media-account-rejection-reasons-lookup.json';

export default class MediaAccountRejectionReasonsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        if (req.query.applicantId && validator.isUUID(req.query.applicantId)) {
            const applicantId = req.query.applicantId;

            return res.render('admin/media-account-rejection-reasons', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-rejection-reasons']),
                applicantId,
                rejectReasons,
                showError: false,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const applicantId = req.body?.['applicantId'];
        const adminId = req.user['userId'];
        const reasons = req.body?.['rejection-reasons'];
        if (reasons && applicantId) {
            const applicantData = await mediaAccountApplicationService.getApplicationByIdAndStatus(
                applicantId,
                'PENDING',
                adminId
            );
            res.render('admin/media-account-rejection', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-rejection']),
                applicantData,
                applicantId,
                reasons,
            });
        } else {
            return res.render('admin/media-account-rejection-reasons', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-rejection-reasons']),
                applicantId,
                rejectReasons,
                showError: true,
            });
        }
    }
}
