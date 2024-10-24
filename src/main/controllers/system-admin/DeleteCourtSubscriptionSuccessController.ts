import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { LocationService } from '../../service/LocationService';
import { cloneDeep } from 'lodash';

const locationService = new LocationService();

export default class DeleteCourtSubscriptionSuccessController {
    public async get(req: PipRequest, res: Response, page: string): Promise<void> {
        const locationId = req.query.locationId as unknown as number;
        const court = await locationService.getLocationById(locationId);
        res.render(`system-admin/${page}`, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[page]),
            court: locationService.formatCourtValue(court),
        });
    }
}
