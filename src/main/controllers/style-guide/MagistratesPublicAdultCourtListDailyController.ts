import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/PublicationService';
import { LocationService } from '../../service/LocationService';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { HttpStatusCode } from 'axios';
import { formatMetaDataListType, isUnexpectedListType, isValidList, isValidListType } from '../../helpers/listHelper';
import { MagistratesPublicAdultCourtListDailyService } from '../../service/listManipulation/MagistratesPublicAdultCourtListDailyService';
import { formatDate } from '../../helpers/dateTimeHelper';

const publicationService = new PublicationService();
const courtService = new LocationService();
const helperService = new ListParseHelperService();
const magistratesAdultCourtListDailyService = new MagistratesPublicAdultCourtListDailyService();

const listPath = 'magistrates-public-adult-court-list-daily';

export default class MagistratesAdultCourtListDailyController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const payload = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const metadataListType = formatMetaDataListType(metadata);

        if (isValidList(payload, metadata) && isValidListType(metadataListType, listPath)) {
            const listData = magistratesAdultCourtListDailyService.processPayload(payload as JSON);
            const returnedLocation = await courtService.getLocationById(metadata['locationId']);
            const locationName = courtService.findCourtName(returnedLocation, req.lng, listPath);

            const printDate = payload['document'].data.job.printdate;
            const publishedDate = formatDate(
                MagistratesAdultCourtListDailyController.toIsoDate(printDate),
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
            isUnexpectedListType(metadataListType, listPath)
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
