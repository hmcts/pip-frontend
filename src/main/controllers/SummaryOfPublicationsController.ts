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
            const locationMetadata = await courtService.getLocationMetadata(parseInt(locationId));

            let cautionMessage = '';
            let noListMessageOverride = '';
            if (locationMetadata) {
                cautionMessage =
                    req.lng === 'cy' ? locationMetadata.welshCautionMessage : locationMetadata.cautionMessage;
                noListMessageOverride =
                    req.lng === 'cy' ? locationMetadata.welshNoListMessage : locationMetadata.noListMessage;
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
                cautionMessage,
                noListMessageOverride,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
