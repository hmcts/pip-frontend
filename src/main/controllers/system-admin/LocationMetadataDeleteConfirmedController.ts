import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';

export default class LocationMetadataDeleteConfirmedController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render(
            'system-admin/location-metadata-delete-confirmed',
            req.i18n.getDataByLanguage(req.lng)['location-metadata-delete-confirmed']
        );
    }
}
