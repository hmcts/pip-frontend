import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { SjpPublicListService } from '../service/listManipulation/SjpPublicListService';
import { SjpFilterService } from '../service/sjpFilterService';
import { FilterService } from '../service/filterService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../helpers/listHelper';
import { ListDownloadService } from '../service/listDownloadService';

const publicationService = new PublicationService();
const helperService = new ListParseHelperService();
const sjpPublicListService = new SjpPublicListService();
const sjpFilterService = new SjpFilterService();
const filterService = new FilterService();
const listDownloadService = new ListDownloadService();

export default class SjpPublicListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query['artefactId'];
        const fileData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(fileData, metaData) && fileData && metaData) {
            const allCases = sjpPublicListService.formatSjpPublicList(JSON.stringify(fileData));
            const filter = sjpFilterService.generateFilters(
                allCases,
                req.query?.filterValues as string,
                req.query?.clear as string
            );

            const publishedTime = helperService.publicationTimeInUkTime(fileData['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                fileData['document']['publicationDate'],
                req.lng
            );
            const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);
            const showDownloadButton = await listDownloadService.generateFiles(artefactId, req.user);

            res.render('single-justice-procedure', {
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['single-justice-procedure']),
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['sjp-common']),
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['list-template']),
                sjpData: filter.sjpCases,
                length: filter.sjpCases.length,
                publishedDateTime: publishedDate,
                publishedTime: publishedTime,
                artefactId: artefactId,
                user: req.user,
                filterOptions: filter.filterOptions,
                showFilters: !!(!!req.query?.filterValues || req.query?.clear),
                showDownloadButton,
            });
        } else if (fileData === HttpStatusCode.NotFound || metaData === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async filterValues(req: PipRequest, res: Response): Promise<void> {
        const filterValues = filterService.generateFilterKeyValues(req.body);
        res.redirect(`sjp-public-list?artefactId=${req.query.artefactId}&filterValues=${filterValues}`);
    }
}
