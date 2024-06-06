import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/PublicationService';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { IacDailyListService } from '../../service/listManipulation/IacDailyListService';
import { HttpStatusCode } from 'axios';
import {
    formatMetaDataListType,
    isOneOfValidListTypes,
    isUnexpectedListType,
    isValidList,
} from '../../helpers/listHelper';

const publicationService = new PublicationService();
const helperService = new ListParseHelperService();
const iacService = new IacDailyListService();

const listType = 'iac-daily-list';
const additionalCasesListType = 'iac-daily-list-additional-cases';

export default class IacDailyListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const metaDataListType = formatMetaDataListType(metaData);

        if (
            isValidList(searchResults, metaData) &&
            isOneOfValidListTypes(metaDataListType, listType, additionalCasesListType)
        ) {
            const listData = iacService.manipulateIacDailyListData(JSON.stringify(searchResults), req.lng);
            const publishedTime = helperService.publicationTimeInUkTime(searchResults['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                searchResults['document']['publicationDate'],
                req.lng
            );

            const languageResource = IacDailyListController.getLanguageResources(req, metaData.listType);

            res.render(`style-guide/${listType}`, {
                ...cloneDeep(languageResource),
                listData: listData,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                provenance: metaData.provenance,
            });
        } else if (
            searchResults === HttpStatusCode.NotFound ||
            metaData === HttpStatusCode.NotFound ||
            isUnexpectedListType(metaDataListType, listType)
        ) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    private static getLanguageResources(req, metadataListType) {
        let languageResource = {
            ...req.i18n.getDataByLanguage(req.lng)['style-guide'][listType],
            ...req.i18n.getDataByLanguage(req.lng)['list-template'],
        };

        if (metadataListType === 'IAC_DAILY_LIST_ADDITIONAL_CASES') {
            languageResource = {
                ...cloneDeep(languageResource),
                ...req.i18n.getDataByLanguage(req.lng)['style-guide'][additionalCasesListType],
            };
        }
        return languageResource;
    }
}
