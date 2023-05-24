import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import { PublicationService } from '../service/publicationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { SjpPressListService } from '../service/listManipulation/SjpPressListService';
import { FilterService } from '../service/filterService';
import { SjpFilterService } from '../service/sjpFilterService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../helpers/listHelper';

const publicationService = new PublicationService();
const helperService = new ListParseHelperService();
const sjpPressListService = new SjpPressListService();
const sjpFilterService = new SjpFilterService();
const filterService = new FilterService();

export default class SjpPressListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const sjpData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(sjpData, metaData)) {
            const allCases = sjpPressListService.formatSJPPressList(JSON.stringify(sjpData));
            const filter = sjpFilterService.generateFilters(
                allCases,
                req.query?.filterValues as string,
                req.query?.clear as string
            );

            const publishedTime = helperService.publicationTimeInUkTime(sjpData['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                sjpData['document']['publicationDate'],
                req.lng
            );

            const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

            res.render('single-justice-procedure-press', {
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['single-justice-procedure-press']),
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['sjp-common']),
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['list-template']),
                sjpData: filter.sjpCases,
                totalHearings: filter.sjpCases.length,
                publishedDateTime: publishedDate,
                publishedTime: publishedTime,
                contactDate: DateTime.fromISO(metaData['contentDate'], {
                    zone: 'Europe/London',
                })
                    .setLocale(req.lng)
                    .toFormat('d MMMM yyyy'),
                artefactId: artefactId,
                user: req.user,
                filterOptions: filter.filterOptions,
                showFilters: !!(!!req.query?.filterValues || req.query?.clear),
            });
        } else if (sjpData === HttpStatusCode.NotFound || metaData === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async filterValues(req: PipRequest, res: Response): Promise<void> {
        const filterValues = filterService.generateFilterKeyValues(req.body);
        res.redirect(`sjp-press-list?artefactId=${req.query.artefactId}&filterValues=${filterValues}`);
    }
}
