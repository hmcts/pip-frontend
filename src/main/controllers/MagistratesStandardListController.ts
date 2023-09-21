import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { MagistratesStandardListService } from '../service/listManipulation/MagistratesStandardListService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../helpers/listHelper';
import { CrimeListsService } from '../service/listManipulation/CrimeListsService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const magsStandardListService = new MagistratesStandardListService();
const crimeListsService = new CrimeListsService();

export default class MagistratesStandardListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(searchResults, metaData) && searchResults && metaData) {
            const publicationJsonString = JSON.stringify(searchResults);
            const manipulatedData = magsStandardListService.manipulatedMagsStandardListData(
                publicationJsonString,
                req.lng,
                'magistrates-standard-list'
            );
            const publishedTime = helperService.publicationTimeInUkTime(searchResults['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                searchResults['document']['publicationDate'],
                req.lng
            );
            const location = await locationService.getLocationById(metaData['locationId']);
            const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);
            const venueAddress = crimeListsService.formatAddress(searchResults['venue']['venueAddress']);

            res.render('magistrates-standard-list', {
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['magistrates-standard-list']),
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['list-template']),
                listData: manipulatedData,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                version: searchResults['document']['version'],
                courtName: location.name,
                provenance: metaData.provenance,
                venueAddress: venueAddress,
                bill: pageLanguage === 'bill',
            });
        } else if (searchResults === HttpStatusCode.NotFound || metaData === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
