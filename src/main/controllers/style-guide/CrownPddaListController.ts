import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { formatMetaDataListType, isUnexpectedListType, isValidList, isValidListType } from '../../helpers/listHelper';
import { HttpStatusCode } from 'axios';
import { cloneDeep } from 'lodash';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { LocationService } from '../../service/LocationService';
import { PublicationService } from '../../service/PublicationService';
import { formatDate } from '../../helpers/dateTimeHelper';
import { CrownPddaListService } from '../../service/listManipulation/CrownPddaListService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const crownPddaListService = new CrownPddaListService();

export default class CrownPddaListController {
    public async get(req: PipRequest, res: Response, listType: string): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const payload = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const metadataListType = formatMetaDataListType(metadata);

        if (isValidList(payload, metadata) && isValidListType(metadataListType, listType)) {
            const listData = crownPddaListService.processPayload(payload as JSON, req.lng, listType);
            const returnedLocation = await locationService.getLocationById(metadata['locationId']);
            const locationName = locationService.findCourtName(returnedLocation, req.lng, listType);

            listType.startsWith('magistrates-public');
            const listPayload = listType.includes('daily') ? payload['DailyList'] : payload['FirmList'];
            const listHeader = listPayload.ListHeader;
            const publishedDate = helperService.publicationDateInUkTime(listHeader.PublishedTime, req.lng);
            const publishedTime = helperService.publicationTimeInUkTime(listHeader.PublishedTime);
            const startDate = formatDate(crownPddaListService.toIsoDate(listHeader.StartDate), 'dd MMMM yyyy', req.lng);
            const endDate = listHeader.EndDate
                ? formatDate(crownPddaListService.toIsoDate(listHeader.EndDate), 'dd MMMM yyyy', req.lng)
                : '';
            const version = listHeader.Version;
            const venueAddress = crownPddaListService.formatAddress(listPayload.CrownCourt.CourtHouseAddress);

            res.render(`style-guide/${listType}`, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[listType]),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
                listData: listData,
                locationName: locationName,
                provenance: metadata.provenance,
                publishedDate,
                publishedTime,
                startDate,
                endDate,
                version,
                venueAddress,
            });
        } else if (
            payload === HttpStatusCode.NotFound ||
            metadata === HttpStatusCode.NotFound ||
            isUnexpectedListType(metadataListType, listType)
        ) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
