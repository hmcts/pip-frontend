import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';
import { CrownFirmListService } from '../service/listManipulation/crownFirmListService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { CivilFamilyAndMixedListService } from '../service/listManipulation/CivilFamilyAndMixedListService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../helpers/listHelper';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const firmListService = new CrownFirmListService();
const civilService = new CivilFamilyAndMixedListService();

export default class CrownFirmListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const jsonData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(jsonData, metaData) && metaData && jsonData) {
            const outputData = civilService.sculptedCivilListData(JSON.stringify(jsonData));
            const outputArray = firmListService.splitOutFirmListData(
                JSON.stringify(outputData),
                req.lng,
                'crown-firm-list'
            );
            const publishedTime = helperService.publicationTimeInUkTime(jsonData['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                jsonData['document']['publicationDate'],
                req.lng
            );
            const location = await locationService.getLocationById(metaData['locationId']);
            const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);
            const dates = firmListService.getSittingDates(outputArray);
            const startDate = DateTime.fromISO(dates[0], {
                zone: 'Europe/London',
            }).toFormat('dd MMMM yyyy');
            const endDate = DateTime.fromISO(dates[dates.length - 1], {
                zone: 'Europe/London',
            }).toFormat('dd MMMM yyyy');

            res.render('crown-firm-list', {
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['crown-firm-list']),
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['list-template']),
                listData: outputData,
                startDate,
                endDate,
                allocated: outputArray,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                publishedDate,
                publishedTime,
                provenance: metaData.provenance,
                version: jsonData['document']['version'],
                courtName: location.name,
                bill: pageLanguage === 'bill',
            });
        } else if (jsonData === HttpStatusCode.NotFound || metaData === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
