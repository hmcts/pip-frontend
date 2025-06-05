import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/LocationService';
import { SummaryOfPublicationsService } from '../service/SummaryOfPublicationsService';

const summaryOfPublicationsService = new SummaryOfPublicationsService();
const locationService = new LocationService();

export default class SummaryOfPublicationsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const locationId = req.query['locationId'] as string;
        if (locationId) {
            const court = await locationService.getLocationById(parseInt(locationId));
            const locationName = locationService.findCourtName(court, req.lng, 'summary-of-publications');
            const locationMetadata = await locationService.getLocationMetadata(
                parseInt(locationId),
                req.user['userId']
            );

            let noCautionMessageOverride = '';
            let noListMessageOverride = '';
            if (locationMetadata !== null && locationMetadata !== undefined) {
                noListMessageOverride =
                    req.lng === 'cy' ? locationMetadata.welshNoListMessage : locationMetadata.noListMessage;
                noCautionMessageOverride =
                    req.lng === 'cy' ? locationMetadata.welshCautionMessage : locationMetadata.cautionMessage;
            }

            const publications = await summaryOfPublicationsService.getPublications(
                parseInt(locationId.toString()),
                req.user?.['userId']
            );

            res.render('summary-of-publications', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['summary-of-publications']),
                publications,
                locationName,
                court,
                noListMessageOverride,
                noCautionMessageOverride,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
