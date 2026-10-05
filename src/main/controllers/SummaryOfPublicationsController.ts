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
        const parsedLocationId = parseInt(locationId);

        if (locationId && !isNaN(parsedLocationId)) {
            const isWelsh = req.lng === 'cy';
            const court = await locationService.getLocationById(locationId as any);
            const locationName = locationService.findCourtName(court, req.lng, 'summary-of-publications');
            const locationMetadata = await locationService.getLocationMetadata(locationId as any);

            let cautionMessageOverride = '';
            let noListMessageOverride = '';
            if (locationMetadata !== null && locationMetadata !== undefined) {
                noListMessageOverride = isWelsh ? locationMetadata.welshNoListMessage : locationMetadata.noListMessage;
                cautionMessageOverride = isWelsh
                    ? locationMetadata.welshCautionMessage
                    : locationMetadata.cautionMessage;
            }

            const copVenueId = await locationService.getCopVenueId();
            const isCopVenue = locationId === copVenueId?.toString();
            const publications = isCopVenue
                ? await publicationService.getPublicationsByListType('COP_DAILY_CAUSE_LIST', req.user?.['userId'])
                : await publicationService.getPublicationsByLocation(locationId, req.user?.['userId']);

            const publicationsWithName = [];
            let locationMap = new Map();
            if (isCopVenue) {
                const allLocations = await locationService.fetchAllLocations(req.lng);
                locationMap = new Map(allLocations.map(loc => [loc.locationId.toString(), loc.name]));
            }

            publications.forEach(publication => {
                const listType = publicationService.getListTypes().get(publication.listType);

                if (listType && !listType.isHidden) {
                    const languageFriendlyName = isWelsh ? listType.welshFriendlyName : listType.friendlyName;

                    let displayName;
                    let listName = languageFriendlyName;

                    if (isCopVenue) {
                        const courtName = locationMap.get(publication.locationId) || '';
                        displayName = courtName ? `${courtName} - ${languageFriendlyName}` : languageFriendlyName;
                        listName = displayName;
                    }

                    const publicationWithName = {
                        ...publication,
                        listName: listName,
                        displayName: displayName,
                    };
                    publicationsWithName.push(publicationWithName);
                }
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
