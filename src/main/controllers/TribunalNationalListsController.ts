import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { TribunalNationalListsService } from '../service/listManipulation/TribunalNationalListsService';
import { LocationService } from '../service/locationService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../helpers/listHelper';

const publicationService = new PublicationService();
const helperService = new ListParseHelperService();
const tribunalNationalListsService = new TribunalNationalListsService();
const locationService = new LocationService();

export default class TribunalNationalListsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const listToLoad = req.path.slice(1, req.path.length);
        const artefactId = req.query.artefactId as string;
        const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(searchResults, metaData) && searchResults && metaData) {
            const manipulatedData = tribunalNationalListsService.manipulateData(
                JSON.stringify(searchResults),
                req.lng,
                listToLoad
            );

            const publishedTime = helperService.publicationTimeInUkTime(searchResults['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                searchResults['document']['publicationDate'],
                req.lng
            );

            const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);
            const returnedCourt = await locationService.getLocationById(metaData['locationId']);
            const courtName = locationService.findCourtName(returnedCourt, req.lng, listToLoad);

            res.render(listToLoad, {
                // The 'open-justice-statement' resource needs to come before the list type resource so it can be
                // overwritten by the statement in list types with specific open justice statement.
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['open-justice-statement']),
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)[listToLoad]),
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['list-template']),
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                listData: manipulatedData,
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                provenance: metaData.provenance,
                courtName: courtName,
                venueEmail: searchResults['venue']['venueContact']['venueEmail'],
                venueTelephone: searchResults['venue']['venueContact']['venueTelephone'],
                bill: pageLanguage === 'bill',
            });
        } else if (searchResults === HttpStatusCode.NotFound || metaData === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
