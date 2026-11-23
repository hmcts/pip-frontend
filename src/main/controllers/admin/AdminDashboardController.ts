import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { MediaAccountApplicationService } from '../../service/MediaAccountApplicationService';
import { UserCommService } from '../../service/UserCommService';

const mediaApplicationService = new MediaAccountApplicationService();
const userCommService = new UserCommService();

export default class AdminDashboardController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const mediaApplications = await mediaApplicationService.getDateOrderedMediaApplications(req.user['userId']);
        const mediaApplicationsCount = mediaApplications.length;
        const userComms = await userCommService.getUserComms();

        res.render('admin/admin-dashboard', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['admin-dashboard']),
            mediaApplicationsCount,
            user: req.user,
            activeAdminDashboard: true,
            userComms,
        });
    }
}
