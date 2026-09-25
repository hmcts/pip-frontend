import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/LocationService';
import { PublicationService } from '../service/PublicationService';

const locationService = new LocationService();
const publicationService = new PublicationService();

export default class SummaryOfPublicationsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const locationId = req.query['locationId'] as string;

        if (locationId && !isNaN(parseInt(locationId))) {
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

            const publications =
                parseInt(locationId) === (await locationService.getCopVenueId())
                    ? await publicationService.getPublicationsByListType('COP_DAILY_CAUSE_LIST', req.user?.['userId'])
                    : await publicationService.getPublicationsByLocation(locationId, req.user?.['userId']);

            const publicationsWithName = [];
            const copVenueId = await locationService.getCopVenueId();
            let locationMap = new Map();
            if (parseInt(locationId) === copVenueId) {
                const allLocations = await locationService.fetchAllLocations(req.lng);
                locationMap = new Map(allLocations.map(loc => [loc.locationId.toString(), loc.name]));
            }

            publications.forEach(publication => {
                const listLookup = publicationService.getListTypes().get(publication.listType);
                let listName = listLookup.friendlyName;
                let displayName;
                if (parseInt(locationId) === copVenueId) {
                    const courtName = locationMap.get(publication.locationId.toString()) || '';
                    const languageFriendlyName = req.lng === 'cy' ? listLookup.welshFriendlyName : listLookup.friendlyName;
                    displayName = courtName ? `${courtName} - ${languageFriendlyName}` : languageFriendlyName;
                    listName = courtName ? `${courtName} - ${listName}` : listName;
                }

                const publicationWithName = {
                    ...publication,
                    listName: listName,
                    displayName: displayName,
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
