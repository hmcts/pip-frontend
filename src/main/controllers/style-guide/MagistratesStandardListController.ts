import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/PublicationService';
import { LocationService } from '../../service/LocationService';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { MagistratesStandardListService } from '../../service/listManipulation/MagistratesStandardListService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../../helpers/listHelper';
import { CrimeListsService } from '../../service/listManipulation/CrimeListsService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const magsStandardListService = new MagistratesStandardListService();
const crimeListsService = new CrimeListsService();

const listType = 'magistrates-standard-list';

export default class MagistratesStandardListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const publicationJson = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(publicationJson, metaData) && publicationJson && metaData) {
            const manipulatedData = magsStandardListService.manipulateData(JSON.stringify(publicationJson), req.lng);
            const publishedTime = helperService.publicationTimeInUkTime(publicationJson['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                publicationJson['document']['publicationDate'],
                req.lng
            );
            const location = await locationService.getLocationById(metaData['locationId']);
            const venueAddress = crimeListsService.formatAddress(publicationJson['venue']['venueAddress']);

            res.render(`style-guide/${listType}`, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['style-guide'][listType]),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
                listData: manipulatedData,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                version: publicationJson['document']['version'],
                courtName: location.name,
                provenance: metaData.provenance,
                venueAddress: venueAddress,
            });
        } else if (publicationJson === HttpStatusCode.NotFound || metaData === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
