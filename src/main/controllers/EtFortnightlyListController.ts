import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { EtListsService } from '../service/listManipulation/EtListsService';
import { LocationService } from '../service/locationService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../helpers/listHelper';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const etListsService = new EtListsService();

const listType = 'et-fortnightly-list';

export default class EtFortnightlyListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query['artefactId'];
        const fileData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(fileData, metaData) && fileData && metaData) {
            const tableData = etListsService.reshapeEtFortnightlyListData(JSON.stringify(fileData), req.lng);
            const publishedTime = helperService.publicationTimeInUkTime(fileData['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                fileData['document']['publicationDate'],
                req.lng
            );
            const venue = {
                venueName: fileData['venue']['venueName'],
                venueEmail: fileData['venue']['venueContact']['venueEmail'],
                venueTelephone: fileData['venue']['venueContact']['venueTelephone'],
            };
            const returnedCourt = await locationService.getLocationById(metaData['locationId']);
            const courtName = locationService.findCourtName(returnedCourt, req.lng, listType);

            res.render(listType, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[listType]),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
                ...venue,
                tableData,
                courtName,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                region: returnedCourt.region,
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                provenance: metaData.provenance,
            });
        } else if (fileData === HttpStatusCode.NotFound || metaData === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
