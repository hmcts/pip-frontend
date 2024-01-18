import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { PublicationService } from '../service/publicationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { LocationService } from '../service/locationService';
import { isValidList } from '../helpers/listHelper';
import { HttpStatusCode } from 'axios';
import { cloneDeep } from 'lodash';
import { CrimeListsService } from '../service/listManipulation/CrimeListsService';
import { OpaResultsService } from '../service/listManipulation/OpaResultsService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const crimeListsService = new CrimeListsService();
const opaResultsService = new OpaResultsService();

const listType = 'opa-results';

export default class OpaResultsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query['artefactId'];
        const jsonData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metadata = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(jsonData, metadata) && jsonData && metadata) {
            const publicationDate = jsonData['document']['publicationDate'];
            const publishedDate = helperService.publicationDateInUkTime(publicationDate, req.lng);
            const publishedTime = helperService.publicationTimeInUkTime(publicationDate);

            const pageLanguage = publicationService.languageToLoadPageIn(metadata.language, req.lng);
            const venueAddress = crimeListsService.formatAddress(jsonData['venue']['venueAddress']);

            const location = await locationService.getLocationById(metadata['locationId']);
            const locationName = pageLanguage === 'cy' ? location.welshName : location.name;
            const listData = opaResultsService.manipulateData(JSON.stringify(jsonData), req.lng);

            res.render(listType, {
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)[listType]),
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['list-template']),
                listData: listData,
                contentDate: helperService.contentDateInUtcTime(metadata['contentDate'], req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                courtName: locationName,
                venueAddress: venueAddress,
                bill: pageLanguage === 'bill',
            });
        } else if (jsonData === HttpStatusCode.NotFound || metadata === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
