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
            searchResults &&
            metaData &&
            isOneOfValidListTypes(metaDataListType, listToLoad, civilListType)
        ) {
            const url = publicationService.getListTypes().get(metaData.listType).url;
            let manipulatedData;
            let partyAtHearingLevel = false;

            if (url === familyDailyListUrl || url === mixedDailyListUrl) {
                if (hearingHasParty(searchResults)) {
                    manipulatedData = civilFamMixedListService.sculptedListDataPartyAtHearingLevel(
                        JSON.stringify(searchResults),
                        true
                    );
                    partyAtHearingLevel = true;
                } else {
                    manipulatedData = civilFamMixedListService.sculptedListData(JSON.stringify(searchResults), true);
                }
            } else {
                manipulatedData = civilFamMixedListService.sculptedListData(JSON.stringify(searchResults));
            }

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
}
