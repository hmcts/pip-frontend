import { PipRequest } from 'models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserCommunicationManagementService } from '../../service/UserCommunicationManagementService';

/**
 * Controller for handling user communication management page
 */
const userCommunicationManagementService = new UserCommunicationManagementService();
export default class UserCommunicationManagementController {
    public async get(req: PipRequest, res: Response): Promise<void> {

        const userCommunicationData =
            await userCommunicationManagementService.fetchAllUserCommunication(req.lng);

        res.render('system-admin/user-communication-management', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['user-communication-management']),
            header: userCommunicationManagementService.getTableHeaders(),
            userCommunicationData: userCommunicationData,
        });
    }
}
