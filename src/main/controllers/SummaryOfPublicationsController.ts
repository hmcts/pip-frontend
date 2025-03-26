import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/LocationService';
import { SummaryOfPublicationsService } from '../service/SummaryOfPublicationsService';

const summaryOfPublicationsService = new SummaryOfPublicationsService();
const courtService = new LocationService();

export default class SummaryOfPublicationsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const locationId = req.query['locationId'] as string;
        if (locationId) {
            const court = await courtService.getLocationById(parseInt(locationId));
            const locationName = courtService.findCourtName(court, req.lng, 'summary-of-publications');
            const additionalLocationInfo = courtService.getAdditionalLocationInfo(locationId);

            let noListMessageOverride = '';
            if (additionalLocationInfo) {
                noListMessageOverride =
                    req.lng === 'cy' ? additionalLocationInfo.welshNoListMessage : additionalLocationInfo.noListMessage;
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
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
