import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/publicationService';
import { ListParseHelperService } from '../../service/listParseHelperService';
import { IacDailyListService } from '../../service/list-manipulation/IacDailyListService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../../helpers/listHelper';

const publicationService = new PublicationService();
const helperService = new ListParseHelperService();
const iacService = new IacDailyListService();

const listType = 'iac-daily-list';
const listPath = `style-guide/${listType}`;

export default class IacDailyListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(searchResults, metaData) && searchResults && metaData) {
            const listData = iacService.manipulateIacDailyListData(JSON.stringify(searchResults), req.lng);
            const publishedTime = helperService.publicationTimeInUkTime(searchResults['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                searchResults['document']['publicationDate'],
                req.lng
            );
            res.render(listPath, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[listPath]),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
                listData: listData,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                provenance: metaData.provenance,
            });
        } else if (searchResults === HttpStatusCode.NotFound || metaData === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
