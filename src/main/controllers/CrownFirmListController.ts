import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';
import { CrownFirmListService } from '../service/listManipulation/crownFirmListService';
import { CrimeListsService } from '../service/listManipulation/CrimeListsService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { HttpStatusCode } from 'axios';
import {hearingHasParty, isValidList} from '../helpers/listHelper';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const firmListService = new CrownFirmListService();
const crimeListsService = new CrimeListsService();

const listType = 'crown-firm-list';
const dateFormat = 'dd MMMM yyyy';

export default class CrownFirmListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const jsonData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(jsonData, metaData) && metaData && jsonData) {
            let outputData;
            if (hearingHasParty(jsonData)) {
                outputData = firmListService.splitOutFirmListDataV1(JSON.stringify(jsonData), req.lng, listType);
            } else {
                outputData = firmListService.splitOutFirmListData(JSON.stringify(jsonData), req.lng, listType);
            }

            const publishedTime = helperService.publicationTimeInUkTime(jsonData['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                jsonData['document']['publicationDate'],
                req.lng
            );
            const location = await locationService.getLocationById(metaData['locationId']);
            const dates = firmListService.getSittingDates(outputData);
            const startDate = DateTime.fromISO(dates[0], { zone: 'Europe/London' }).toFormat(dateFormat);
            const endDate = DateTime.fromISO(dates[dates.length - 1], { zone: 'Europe/London' }).toFormat(dateFormat);
            const venueAddress = crimeListsService.formatAddress(jsonData['venue']['venueAddress']);

            res.render(listType, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[listType]),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
                listData: jsonData,
                startDate,
                endDate,
                allocated: outputData,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                publishedDate,
                publishedTime,
                provenance: metaData.provenance,
                version: jsonData['document']['version'],
                courtName: location.name,
                venueAddress: venueAddress,
            });
        } else if (jsonData === HttpStatusCode.NotFound || metaData === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
