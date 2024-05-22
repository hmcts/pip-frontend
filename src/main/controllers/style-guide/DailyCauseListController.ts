import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/PublicationService';
import { LocationService } from '../../service/LocationService';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { CivilFamilyAndMixedListService } from '../../service/listManipulation/CivilFamilyAndMixedListService';
import { HttpStatusCode } from 'axios';
import {
    formatMetaDataListType,
    hearingHasParty,
    isOneOfValidListTypes,
    isValidList,
    missingListType,
} from '../../helpers/listHelper';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const civilFamMixedListService = new CivilFamilyAndMixedListService();

const familyDailyListUrl = publicationService.getListTypes().get('FAMILY_DAILY_CAUSE_LIST').url;
const mixedDailyListUrl = publicationService.getListTypes().get('CIVIL_AND_FAMILY_DAILY_CAUSE_LIST').url;
const civilListType = 'civil-daily-cause-list';

export default class DailyCauseListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const listToLoad = req.path.slice(1, req.path.length);

        const artefactId = req.query.artefactId as string;
        const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const metaDataListType = formatMetaDataListType(metaData);

        if (
            isValidList(searchResults, metaData) &&
            isOneOfValidListTypes(metaDataListType, listToLoad, civilListType)
        ) {
            const url = publicationService.getListTypes().get(metaData.listType).url;
            const manipulatedData = DailyCauseListController.manipulateListData(url, searchResults);
            const partyAtHearingLevel = (url === familyDailyListUrl || url === mixedDailyListUrl)
                && hearingHasParty(searchResults);
            const displayLinkToCourtDetails = url === mixedDailyListUrl && metaData.locationId === '3';

            const publishedTime = helperService.publicationTimeInUkTime(searchResults['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                searchResults['document']['publicationDate'],
                req.lng
            );
            const location = await locationService.getLocationById(metaData['locationId']);

            res.render(`style-guide/${listToLoad}`, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['style-guide'][listToLoad]),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['open-justice-statement']),
                listData: manipulatedData,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                provenance: metaData.provenance,
                courtName: location.name,
                partyAtHearingLevel,
                displayLinkToCourtDetails,
            });
        } else if (
            searchResults === HttpStatusCode.NotFound ||
            metaData === HttpStatusCode.NotFound ||
            (!missingListType(metaDataListType) && !isOneOfValidListTypes(metaDataListType, listToLoad, civilListType))
        ) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    private static manipulateListData(url, searchResults) {
        if (url === familyDailyListUrl || url === mixedDailyListUrl) {
            return hearingHasParty(searchResults)
                ? civilFamMixedListService.sculptedListDataPartyAtHearingLevel(JSON.stringify(searchResults), true)
                : civilFamMixedListService.sculptedListData(JSON.stringify(searchResults), true);
        } else {
            return civilFamMixedListService.sculptedListData(JSON.stringify(searchResults));
        }
    }
}
