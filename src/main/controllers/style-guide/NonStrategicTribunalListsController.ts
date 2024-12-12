import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { PublicationService } from '../../service/PublicationService';
import {
    formatMetaDataListType,
    isValidList,
    isValidListType,
    getParentPage,
    isUnexpectedListType,
} from '../../helpers/listHelper';
import { cloneDeep } from 'lodash';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { HttpStatusCode } from 'axios';

const publicationService = new PublicationService();
const helperService = new ListParseHelperService();

export default class NonStrategicTribunalListsController {
    public async get(req: PipRequest, res: Response, page: string): Promise<void> {
        const artefactId = req.query.artefactId as string;
        if (artefactId) {
            const searchResults = await publicationService.getIndividualPublicationJson(
                artefactId,
                req.user?.['userId']
            );
            const metaData = await publicationService.getIndividualPublicationMetadata(
                artefactId,
                req.user?.['userId']
            );
            const metaDataListType = formatMetaDataListType(metaData);

            if (isValidList(searchResults, metaData) && isValidListType(metaDataListType, page)) {
                const parentPage = getParentPage(metaData.listType);
                const styleGuidePage = parentPage ? parentPage : page;
                const languageOptions = {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[page]),
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
                };
                if (parentPage) {
                    Object.assign(languageOptions, cloneDeep(req.i18n.getDataByLanguage(req.lng)[parentPage]));
                }

                res.render(`style-guide/${styleGuidePage}`, {
                    ...languageOptions,
                    listData: searchResults,
                    provenance: metaData.provenance,
                    contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                });
            } else if (
                searchResults === HttpStatusCode.NotFound ||
                metaData === HttpStatusCode.NotFound ||
                isUnexpectedListType(metaDataListType, page)
            ) {
                res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
            } else {
                res.render('error', req.i18n.getDataByLanguage(req.lng).error);
            }
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
