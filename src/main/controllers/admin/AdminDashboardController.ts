import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { MediaAccountApplicationService } from '../../service/MediaAccountApplicationService';
import { UserCommunicationService } from '../../service/UserCommunicationService';

const mediaApplicationService = new MediaAccountApplicationService();
const userCommunicationService = new UserCommunicationService();

export default class AdminDashboardController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const mediaApplications = await mediaApplicationService.getDateOrderedMediaApplications(req.user['userId']);
        const mediaApplicationsCount = mediaApplications.length;
        const userCommunications = await userCommunicationService.groupCommunicationMessages();

        res.render('admin/admin-dashboard', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['admin-dashboard']),
            mediaApplicationsCount,
            user: req.user,
            activeAdminDashboard: true,
            userCommunications,
        });
    }
}
