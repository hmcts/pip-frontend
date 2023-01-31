import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { civilFamilyAndMixedListService } from '../service/listManipulation/CivilFamilyAndMixedListService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const civFamMixedListService = new civilFamilyAndMixedListService();

export default class DailyCauseListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const listToLoad = req.path.slice(1, req.path.length);
        const artefactId = req.query.artefactId as string;
        const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (searchResults && metaData) {
            const manipulatedData = civFamMixedListService.sculptedCivilFamilyMixedListData(
                JSON.stringify(searchResults)
            );

            const publishedTime = helperService.publicationTimeInUkTime(searchResults['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                searchResults['document']['publicationDate'],
                req.lng
            );

            const location = await locationService.getLocationById(metaData['locationId']);

            const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

            res.render(listToLoad, {
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)[listToLoad]),
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['list-template']),
                listData: manipulatedData,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                provenance: metaData['provenance'],
                courtName: location.name,
                bill: pageLanguage === 'bill',
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
