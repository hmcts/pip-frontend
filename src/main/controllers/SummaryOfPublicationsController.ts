import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/LocationService';
import { SummaryOfPublicationsService } from '../service/SummaryOfPublicationsService';
import { PublicationService } from '../service/PublicationService';

const summaryOfPublicationsService = new SummaryOfPublicationsService();
const locationService = new LocationService();
const publicationService = new PublicationService();

export default class SummaryOfPublicationsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const locationId = req.query['locationId'] as string;
        if (locationId) {
            const court = await locationService.getLocationById(parseInt(locationId));
            const locationName = locationService.findCourtName(court, req.lng, 'summary-of-publications');
            const locationMetadata = await locationService.getLocationMetadata(parseInt(locationId));

            let cautionMessageOverride = '';
            let noListMessageOverride = '';
            if (locationMetadata !== null && locationMetadata !== undefined) {
                noListMessageOverride =
                    req.lng === 'cy' ? locationMetadata.welshNoListMessage : locationMetadata.noListMessage;
                cautionMessageOverride =
                    req.lng === 'cy' ? locationMetadata.welshCautionMessage : locationMetadata.cautionMessage;
            }

            const publications = await summaryOfPublicationsService.getPublications(
                parseInt(locationId.toString()),
                req.user?.['userId']
            );

            const publicationsWithName = [];
            publications.forEach(publication => {
                const friendlyName = publicationService.getListTypes().get(publication.listType).friendlyName;
                const publicationWithName = {
                    ...publication,
                    listName: friendlyName,
                };
                publicationsWithName.push(publicationWithName);
            });

            res.render('summary-of-publications', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['summary-of-publications']),
                publications: publicationsWithName,
                locationName,
                court,
                noListMessageOverride,
                cautionMessageOverride,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
