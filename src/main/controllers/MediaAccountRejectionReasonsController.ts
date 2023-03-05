import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { MediaAccountApplicationService } from '../service/mediaAccountApplicationService';
import path from 'path';

const mediaAccountApplicationService = new MediaAccountApplicationService();
const url = 'media-account-rejection-reasons';

export default class MediaAccountRejectionReasonsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const applicantId = req.query['applicantId'];
        const fs = require('fs');
        const rejectReasons = JSON.parse(
            fs.readFileSync(path.resolve(__dirname, '../modules/nunjucks/media-account-rejection-reasons-lookup.json'))
        );
        return res.render(url, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[url]),
            applicantId,
            rejectReasons,
        });
    }
    public async post(req: PipRequest, res: Response): Promise<void> {
        const applicantId = req.body['applicantId'];
        const reasons = req.body['rejection-reasons'];
        if (await mediaAccountApplicationService.rejectApplication(applicantId, req.user?.['userId'])) {
            const uri = new URL('/media-account-rejection-confirmation/', process.env.FRONTEND_URL);
            uri.searchParams.append('applicantId', applicantId);
            uri.searchParams.append('reasons', reasons);
            return res.redirect(uri.href);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
