import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';

export default class LocationMetadataCreateConfirmedController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render(
            'system-admin/location-metadata-create-confirmed',
            req.i18n.getDataByLanguage(req.lng)['location-metadata-create-confirmed']
        );
    }
}
