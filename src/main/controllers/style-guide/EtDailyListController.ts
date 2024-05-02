import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/PublicationService';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { LocationService } from '../../service/LocationService';
import { EtListsService } from '../../service/listManipulation/EtListsService';
import { HttpStatusCode } from 'axios';
import { formatMetaDataListType, isUnexpectedListType, isValidList, isValidListType } from '../../helpers/listHelper';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const etDailyListService = new EtListsService();

const listUrl = 'et-daily-list';
const listPath = `style-guide/${listUrl}`;

export default class EtDailyListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query['artefactId'];
        const fileData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const metadataListType = formatMetaDataListType(metadata);

        if (isValidList(fileData, metadata) && fileData && metadata && isValidListType(metadataListType, listUrl)) {
            const listData = etDailyListService.reshapeEtLists(JSON.stringify(fileData), req.lng);

            const publishedTime = helperService.publicationTimeInUkTime(fileData['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                fileData['document']['publicationDate'],
                req.lng
            );
            const returnedCourt = await locationService.getLocationById(metadata['locationId']);
            const courtName = locationService.findCourtName(returnedCourt, req.lng, listPath);
            res.render(listPath, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['style-guide'][listUrl]),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
                listData,
                courtName,
                contentDate: helperService.contentDateInUtcTime(metadata['contentDate'], req.lng),
                region: returnedCourt.region,
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                provenance: metadata.provenance,
            });
        } else if (
            fileData === HttpStatusCode.NotFound ||
            metadata === HttpStatusCode.NotFound ||
            isUnexpectedListType(metadataListType, listUrl)
        ) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
