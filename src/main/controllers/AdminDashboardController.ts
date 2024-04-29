import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { MediaAccountApplicationService } from '../service/MediaAccountApplicationService';

const mediaApplicationService = new MediaAccountApplicationService();

export default class AdminDashboardController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const mediaApplications = await mediaApplicationService.getDateOrderedMediaApplications();
        const mediaApplicationsCount = mediaApplications.length;
        res.render('admin-dashboard', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['admin-dashboard']),
            mediaApplicationsCount,
            user: req.user,
        });
    }
}
