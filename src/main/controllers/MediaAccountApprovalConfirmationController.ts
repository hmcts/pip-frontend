import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { MediaAccountApplicationService } from '../service/mediaAccountApplicationService';
import { cloneDeep } from 'lodash';

const url = 'media-account-approval-confirmation';
const mediaAccountApplicationService = new MediaAccountApplicationService();

export default class MediaAccountApprovalConfirmationController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        if (req.query?.applicantId) {
            const applicantData = await mediaAccountApplicationService.getApplicationById(req.query.applicantId);
            return res.render(url, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[url]),
                applicantData: applicantData,
            });
        }
        return res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
}
