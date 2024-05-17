import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import { PublicationService } from '../../service/PublicationService';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { SjpPressListService } from '../../service/listManipulation/SjpPressListService';
import { FilterService } from '../../service/FilterService';
import { SjpFilterService } from '../../service/SjpFilterService';
import { HttpStatusCode } from 'axios';
import { formatMetaDataListType, isOneOfValidListTypes, isValidList, missingListType } from '../../helpers/listHelper';
import { ListDownloadService } from '../../service/ListDownloadService';

const publicationService = new PublicationService();
const helperService = new ListParseHelperService();
const sjpPressListService = new SjpPressListService();
const sjpFilterService = new SjpFilterService();
const filterService = new FilterService();
const listDownloadService = new ListDownloadService();

const sjpPressAll = 'single-justice-procedure-press';
const sjpPressDelta = 'single-justice-procedure-press-new-cases';
const sjpListType = 'sjp-press-list';
const sjpDeltaListType = 'sjp-delta-press-list';

export default class SjpPressListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const sjpData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const metaDataListType = formatMetaDataListType(metaData);

        if (isValidList(sjpData, metaData) && isOneOfValidListTypes(metaDataListType, sjpListType, sjpDeltaListType)) {
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

            const showDownloadButton = await listDownloadService.showDownloadButton(artefactId, req.user);
            const url = publicationService.getListTypes().get(metaData.listType).url;
            const languageResource = SjpPressListController.getLanguageResources(req, metaData.listType);

            res.render(`style-guide/${sjpPressAll}`, {
                ...cloneDeep(languageResource),
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
                showDownloadButton,
                url,
            });
        } else if (
            sjpData === HttpStatusCode.NotFound ||
            metaData === HttpStatusCode.NotFound ||
            (!missingListType(metaDataListType) &&
                !isOneOfValidListTypes(metaDataListType, sjpListType, sjpDeltaListType))
        ) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async filterValues(req: PipRequest, res: Response): Promise<void> {
        const filterValues = filterService.generateFilterKeyValues(req.body);
        res.redirect(`sjp-press-list?artefactId=${req.query.artefactId as string}&filterValues=${filterValues}`);
    }

    private static getLanguageResources(req, listType) {
        let languageResource = {
            ...req.i18n.getDataByLanguage(req.lng)['style-guide'][sjpPressAll],
            ...req.i18n.getDataByLanguage(req.lng)['style-guide']['sjp-common'],
            ...req.i18n.getDataByLanguage(req.lng)['list-template'],
        };

        if (listType === 'SJP_DELTA_PRESS_LIST') {
            languageResource = {
                ...cloneDeep(languageResource),
                ...req.i18n.getDataByLanguage(req.lng)['style-guide'][sjpPressDelta],
            };
        }
        return languageResource;
    }
}
