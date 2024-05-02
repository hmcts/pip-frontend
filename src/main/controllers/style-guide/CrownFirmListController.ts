import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import { PublicationService } from '../../service/PublicationService';
import { LocationService } from '../../service/LocationService';
import { CrownFirmListService } from '../../service/listManipulation/CrownFirmListService';
import { CrimeListsService } from '../../service/listManipulation/CrimeListsService';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { HttpStatusCode } from 'axios';
import {
    formatMetaDataListType,
    hearingHasParty,
    isValidList,
    isValidListType,
    missingListType,
} from '../../helpers/listHelper';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const firmListService = new CrownFirmListService();
const crimeListsService = new CrimeListsService();

const listType = 'crown-firm-list';
const listPath = `style-guide/${listType}`;
const dateFormat = 'dd MMMM yyyy';

export default class CrownFirmListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const jsonData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const metaDataListType = formatMetaDataListType(metaData);

        if (isValidList(jsonData, metaData) && metaData && jsonData && isValidListType(metaDataListType, listType)) {
            let outputData;
            if (hearingHasParty(jsonData)) {
                outputData = firmListService.splitOutFirmListDataV1(JSON.stringify(jsonData), req.lng, listPath);
            } else {
                outputData = firmListService.splitOutFirmListData(JSON.stringify(jsonData), req.lng, listPath);
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

            res.render(listPath, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['style-guide'][listType]),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
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
        } else if (
            jsonData === HttpStatusCode.NotFound ||
            metaData === HttpStatusCode.NotFound ||
            (!missingListType(metaDataListType) && !isValidListType(metaDataListType, listType))
        ) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
