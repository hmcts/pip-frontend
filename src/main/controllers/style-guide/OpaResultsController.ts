import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { PublicationService } from '../../service/PublicationService';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { LocationService } from '../../service/LocationService';
import { formatMetaDataListType, isUnexpectedListType, isValidList, isValidListType } from '../../helpers/listHelper';
import { HttpStatusCode } from 'axios';
import { cloneDeep } from 'lodash';
import { CrimeListsService } from '../../service/listManipulation/CrimeListsService';
import { OpaResultsService } from '../../service/listManipulation/OpaResultsService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const crimeListsService = new CrimeListsService();
const opaResultsService = new OpaResultsService();

const listType = 'opa-results';

export default class OpaResultsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query['artefactId'];
        const jsonData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const metadataListType = formatMetaDataListType(metaData);

        if (isValidList(jsonData, metaData) && isValidListType(metadataListType, listType)) {
            const publicationDate = jsonData['document']['publicationDate'];
            const publishedDate = helperService.publicationDateInUkTime(publicationDate, req.lng);
            const publishedTime = helperService.publicationTimeInUkTime(publicationDate);
            const venueAddress = crimeListsService.formatAddress(jsonData['venue']['venueAddress']);
            const location = await locationService.getLocationById(metaData['locationId']);
            const locationName = req.lng === 'cy' ? location.welshName : location.name;
            const listData = opaResultsService.manipulateData(JSON.stringify(jsonData), req.lng);

            res.render(`style-guide/${listType}`, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[listType]),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
                listData: listData,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                courtName: locationName,
                venueAddress: venueAddress,
            });
        } else if (
            jsonData === HttpStatusCode.NotFound ||
            metaData === HttpStatusCode.NotFound ||
            isUnexpectedListType(metadataListType, listType)
        ) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
