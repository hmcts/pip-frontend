import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/locationService';
import { SummaryOfPublicationsService } from '../service/summaryOfPublicationsService';

const summaryOfPublicationsService = new SummaryOfPublicationsService();
const locationService = new LocationService();
export default class BlobViewPublicationsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const locationId = req.query['locationId'];
        if (locationId) {
            let court;
            let locationName = '';
            let listOfPublications = [];

            // reusing summary-of-pubs language file and service as this is essentially the same kind of page.
            // If the location being asked for is noMatch we do not need to request data from the API as it is not a real location
            const noMatchArtefact = locationId.toString() === 'noMatch';
            if (!noMatchArtefact) {
                court = await locationService.getLocationById(parseInt(locationId.toString()));
                locationName = locationService.findCourtName(court, req.lng, 'summary-of-publications');
                listOfPublications = await summaryOfPublicationsService.getPublications(
                    parseInt(locationId.toString()),
                    req.user['userId']
                );
            } else {
                locationName = 'No match artefacts';
                listOfPublications = await summaryOfPublicationsService.getNoMatchPublications();
            }

            res.render('blob-view-publications', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['blob-view-publications']),
                listOfPublications: listOfPublications,
                locationName,
                noMatchArtefact,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
