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

const familyDailyListUrl = publicationService.getListTypes().get('FAMILY_DAILY_CAUSE_LIST').url;
const mixedDailyListUrl = publicationService.getListTypes().get('CIVIL_AND_FAMILY_DAILY_CAUSE_LIST').url;

export default class DailyCauseListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const listToLoad = req.path.slice(1, req.path.length);
        const artefactId = req.query.artefactId as string;
        const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (searchResults && metaData) {
            const url = publicationService.getListTypes().get(metaData.listType).url;
            let manipulatedData;
            if (url === familyDailyListUrl || url === mixedDailyListUrl) {
                manipulatedData = civFamMixedListService.sculptedFamilyMixedListData(JSON.stringify(searchResults));
            } else {
                manipulatedData = civFamMixedListService.sculptedCivilListData(JSON.stringify(searchResults));
            }

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
