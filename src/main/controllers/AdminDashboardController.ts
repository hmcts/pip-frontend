import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import {MediaApplicationService} from "../service/mediaApplicationService";

const mediaApplicationService = new MediaApplicationService();

export default class AdminDashboardController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const mediaApplications = await mediaApplicationService.getDateOrderedMediaApplications();
        res.render('admin-dashboard', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['admin-dashboard']),
            mediaApplications,
            user: req.user,
        });
    }
}
