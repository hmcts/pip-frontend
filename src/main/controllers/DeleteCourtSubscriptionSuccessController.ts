import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { LocationService } from '../service/locationService';
import { cloneDeep } from 'lodash';

const locationService = new LocationService();

export default class DeleteCourtSubscriptionSuccessController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const pageToLoad = req.path.slice(1, req.path.length);
        const locationId = req.query.locationId as unknown as number;
        const court = await locationService.getLocationById(locationId);
        res.render(pageToLoad, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[pageToLoad]),
            court: locationService.formatCourtValue(court),
        });
    }
}
