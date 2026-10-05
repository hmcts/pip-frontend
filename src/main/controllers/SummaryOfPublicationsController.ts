import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { LocationService } from '../service/LocationService';
import { PublicationService } from '../service/PublicationService';
import { LocationMetadata } from '../models/LocationMetadata';
import { Artefact } from '../models/Artefact';
import { ListType } from '../models/ListType';

const locationService = new LocationService();
const publicationService = new PublicationService();

export default class SummaryOfPublicationsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const locationId = req.query['locationId'] as string;
        const parsedLocationId = Number.parseInt(locationId);

        if (!locationId || Number.isNaN(parsedLocationId)) {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
            return;
        }

        const isWelsh = req.lng === 'cy';
        const court = await locationService.getLocationById(locationId as any);
        const locationName = locationService.findCourtName(court, req.lng, 'summary-of-publications');
        const locationMetadata = await locationService.getLocationMetadata(locationId as any);

        const { noListMessageOverride, cautionMessageOverride } = this.getMessageOverrides(locationMetadata, isWelsh);

        const copVenueId = await locationService.getCopVenueId();
        const isCopVenue = locationId === copVenueId?.toString();
        const publications = isCopVenue
            ? await publicationService.getPublicationsByListType('COP_DAILY_CAUSE_LIST', req.user?.['userId'])
            : await publicationService.getPublicationsByLocation(locationId, req.user?.['userId']);

        let locationMap = new Map();
        if (isCopVenue) {
            const allLocations = await locationService.fetchAllLocations(req.lng);
            locationMap = new Map(allLocations.map(loc => [loc.locationId.toString(), loc.name]));
        }

        const publicationsWithName = this.buildPublicationsWithName(publications, isWelsh, isCopVenue, locationMap);

        res.render('summary-of-publications', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['summary-of-publications']),
            publications: publicationsWithName,
            locationName,
            court,
            noListMessageOverride,
            cautionMessageOverride,
        });
    }

    private getMessageOverrides(locationMetadata: LocationMetadata, isWelsh: boolean): any {
        let noListMessageOverride = '';
        let cautionMessageOverride = '';
        if (locationMetadata) {
            noListMessageOverride = isWelsh ? locationMetadata.welshNoListMessage : locationMetadata.noListMessage;
            cautionMessageOverride = isWelsh ? locationMetadata.welshCautionMessage : locationMetadata.cautionMessage;
        }
        return { noListMessageOverride, cautionMessageOverride };
    }

    private buildPublicationsWithName(
        publications: Artefact[],
        isWelsh: boolean,
        isCopVenue: boolean,
        locationMap: Map<string, string>
    ): any[] {
        const publicationsWithName = [];
        publications.forEach(publication => {
            const listType = publicationService.getListTypes().get(publication.listType);

            if (listType && !listType.isHidden) {
                publicationsWithName.push(this.formatPublication(publication, listType, isWelsh, isCopVenue, locationMap));
            }
        });
        return publicationsWithName;
    }

    private formatPublication(
        publication: Artefact,
        listType: ListType,
        isWelsh: boolean,
        isCopVenue: boolean,
        locationMap: Map<string, string>
    ): any {
        const languageFriendlyName = isWelsh ? listType.welshFriendlyName : listType.friendlyName;
        let displayName;
        let listName = languageFriendlyName;

        if (isCopVenue) {
            const courtName = locationMap.get(publication.locationId) || '';
            displayName = courtName ? `${courtName} - ${languageFriendlyName}` : languageFriendlyName;
            listName = displayName;
        }

        return {
            ...publication,
            listName: listName,
            displayName: displayName,
        };
    }
}
