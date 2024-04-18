import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { PublicationService } from '../../service/publicationService';
import { ListParseHelperService } from '../../service/listParseHelperService';
import { LocationService } from '../../service/locationService';
import { isValidList } from '../../helpers/listHelper';
import { HttpStatusCode } from 'axios';
import { cloneDeep } from 'lodash';
import { CrimeListsService } from '../../service/list-manipulation/CrimeListsService';
import { OpaPressListService } from '../../service/list-manipulation/OpaPressListService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const crimeListsService = new CrimeListsService();
const opaPressListService = new OpaPressListService();

const listType = 'opa-press-list';
const listPath = `style-guide/${listType}`;

export default class OpaPressListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query['artefactId'];
        const jsonData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(jsonData, metadata) && jsonData && metadata) {
            const publicationDate = jsonData['document']['publicationDate'];
            const publishedDate = helperService.publicationDateInUkTime(publicationDate, req.lng);
            const publishedTime = helperService.publicationTimeInUkTime(publicationDate);

            const venueAddress = crimeListsService.formatAddress(jsonData['venue']['venueAddress']);

            const location = await locationService.getLocationById(metadata['locationId']);
            const locationName = req.lng === 'cy' ? location.welshName : location.name;
            const listData = opaPressListService.manipulateData(JSON.stringify(jsonData));

            res.render(listPath, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[listPath]),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
                listData: listData,
                contentDate: helperService.contentDateInUtcTime(metadata['contentDate'], req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                version: jsonData['document']['version'],
                courtName: locationName,
                venueAddress: venueAddress,
            });
        } else if (jsonData === HttpStatusCode.NotFound || metadata === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
