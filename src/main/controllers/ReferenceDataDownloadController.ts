import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { LocationRequests } from '../resources/requests/locationRequests';
import { UserManagementService } from '../service/userManagementService';

const locationRequests = new LocationRequests();
const userManagementService = new UserManagementService();
export default class ReferenceDataDownloadController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        await userManagementService.auditAction(
            req.user,
            'REFERENCE_DATA_DOWNLOAD',
            'Download of the reference data requested'
        );
        const returnedData = await locationRequests.getLocationsCsv(req.user['userId']);

        res.set('Content-Disposition', 'inline;filename=' + 'referenceData.csv');
        res.set('Content-Type', 'application/csv');
        res.send(returnedData);
    }
}
