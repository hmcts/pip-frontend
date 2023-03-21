import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/locationService';
import { SummaryOfPublicationsService } from '../service/summaryOfPublicationsService';

const summaryOfPublicationsService = new SummaryOfPublicationsService();
const courtService = new LocationService();

export default class SummaryOfPublicationsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const locationId = req.query['locationId'];
        if (locationId) {
            const court = await courtService.getLocationById(parseInt(locationId.toString()));
            const locationName = courtService.findCourtName(court, req.lng, 'summary-of-publications');
            const publications = await summaryOfPublicationsService.getPublications(
                parseInt(locationId.toString()),
                req.user?.['userId']
            );

            res.render('summary-of-publications', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['summary-of-publications']),
                publications,
                locationName,
                court,
                isSjp: locationId === '9', //TODO: To be removed when custom messages are added to reference data
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
