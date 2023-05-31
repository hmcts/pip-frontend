import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { CrownWarnedListService } from '../service/listManipulation/CrownWarnedListService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../helpers/listHelper';

const publicationService = new PublicationService();
const helperService = new ListParseHelperService();
const crownWarnedListService = new CrownWarnedListService();

const listUrl = 'crown-warned-list';
const toBeAllocated = 'To be allocated';
const toBeAllocatedLowerCase = toBeAllocated.toLowerCase();

export default class CrownWarnedListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(searchResults, metaData) && searchResults && metaData) {
            const publishedTime = helperService.publicationTimeInUkTime(searchResults['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                searchResults['document']['publicationDate'],
                req.lng
            );
            const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);
            const listData = crownWarnedListService.manipulateData(JSON.stringify(searchResults), req.lng);

            // Sort unallocated list entry to the end of the map so it appears last on the template
            const sortedListData = new Map(
                [...listData].sort(([a], [b]) => {
                    if (toBeAllocatedLowerCase === a.toLowerCase()) {
                        return 1;
                    } else if (toBeAllocatedLowerCase === b.toLowerCase()) {
                        return -1;
                    }
                    return 0;
                })
            );

            res.render(listUrl, {
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)[listUrl]),
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['list-template']),
                listData: sortedListData,
                venue: searchResults['venue'],
                contentDate: crownWarnedListService.formatContentDate(metaData.contentDate, req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                version: searchResults['document']['version'],
                provenance: metaData.provenance,
                bill: pageLanguage === 'bill',
            });
        } else if (searchResults === HttpStatusCode.NotFound || metaData === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
