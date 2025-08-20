import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/PublicationService';
import { LocationService } from '../../service/LocationService';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { HttpStatusCode } from 'axios';
import { formatMetaDataListType, isUnexpectedListType, isValidList, isValidListType } from '../../helpers/listHelper';
import { MagistratesAdultCourtListService } from '../../service/listManipulation/MagistratesAdultCourtListService';
import { formatDate } from '../../helpers/dateTimeHelper';

const publicationService = new PublicationService();
const courtService = new LocationService();
const helperService = new ListParseHelperService();
const magistratesAdultCourtListService = new MagistratesAdultCourtListService();

const standardListPath = 'magistrates-adult-court-list';
const publicListPath = 'magistrates-public-adult-court-list-daily';

export default class MagistratesAdultCourtListController {
    public async get(req: PipRequest, res: Response, listType: string): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const payload = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const metadataListType = formatMetaDataListType(metadata);

        if (isValidList(payload, metadata) && isValidListType(metadataListType, listType)) {
            const listPath = listType.startsWith('magistrates-public') ? publicListPath : standardListPath;

            const listData = magistratesAdultCourtListService.processPayload(
                payload as JSON,
                req.lng,
                !listType.startsWith('magistrates-public')
            );
            const returnedLocation = await courtService.getLocationById(metadata['locationId']);
            const locationName = courtService.findCourtName(returnedLocation, req.lng, listPath);

            const printDate = payload['document'].data.job.printdate;
            const publishedDate = formatDate(
                MagistratesAdultCourtListController.toIsoDate(printDate),
                'dd MMMM yyyy',
                req.lng
            );

            const printStartTime = payload['document'].info?.start_time;
            const publishedTime = printStartTime ? helperService.publicationTimeInUkTime(printStartTime) : '';

            res.render(`style-guide/${listPath}`, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[listPath]),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
                listData: listData,
                contentDate: helperService.contentDateInUtcTime(metadata['contentDate'], req.lng),
                locationName: locationName,
                provenance: metadata.provenance,
                publishedDate,
                publishedTime,
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

    private static toIsoDate(date: string): string {
        const dateParts = date.split('/');
        return new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0])).toISOString();
    }
}
