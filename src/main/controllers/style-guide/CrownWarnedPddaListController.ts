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
import { CrownWarnedPddaListService } from '../../service/listManipulation/CrownWarnedPddaListService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const crownPddaListService = new CrownPddaListService();
const crownWarnedPddaListService = new CrownWarnedPddaListService();
const listType = 'crown-warned-pdda-list';

export default class CrownWarnedPddaListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const payload = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const metadataListType = formatMetaDataListType(metadata);

        if (isValidList(payload, metadata) && isValidListType(metadataListType, listType)) {
            const returnedLocation = await locationService.getLocationById(metadata['locationId']);
            const locationName = locationService.findCourtName(returnedLocation, req.lng, listType);

            const listPayload = payload['WarnedList'];
            const listHeader = listPayload.ListHeader;
            const publishedDate = helperService.publicationDateInUkTime(listHeader.PublishedTime, req.lng);
            const publishedTime = helperService.publicationTimeInUkTime(listHeader.PublishedTime);
            const startDate = formatDate(crownPddaListService.toIsoDate(listHeader.StartDate), 'dd MMMM yyyy', req.lng);
            const endDate = listHeader.EndDate
                    ? formatDate(crownPddaListService.toIsoDate(listHeader.EndDate), 'dd MMMM yyyy', req.lng)
                    : '';
            const version = listHeader.Version;
            const venueAddress = crownPddaListService.formatAddress(listPayload.CrownCourt.CourtHouseAddress);

            const listData = crownWarnedPddaListService.processPayload(payload as JSON);

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
