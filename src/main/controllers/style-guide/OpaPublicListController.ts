import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/PublicationService';
import { LocationService } from '../../service/LocationService';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { HttpStatusCode } from 'axios';
import { formatMetaDataListType, isValidList, isValidListType, missingListType } from '../../helpers/listHelper';
import { CrimeListsService } from '../../service/listManipulation/CrimeListsService';
import { OpaPublicListService } from '../../service/listManipulation/OpaPublicListService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const crimeListsService = new CrimeListsService();
const opaPublicListService = new OpaPublicListService();

const listType = 'opa-public-list';

export default class OpaPublicListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const metaDataListType = formatMetaDataListType(metaData);

        if (
            isValidList(searchResults, metaData) &&
            searchResults &&
            metaData &&
            isValidListType(metaDataListType, listType)
        ) {
            const listData = opaPublicListService.formatOpaPublicList(JSON.stringify(searchResults));
            const publishedTime = helperService.publicationTimeInUkTime(searchResults['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                searchResults['document']['publicationDate'],
                req.lng
            );
            const location = await locationService.getLocationById(metaData['locationId']);
            const locationName = req.lng === 'cy' ? location.welshName : location.name;
            const venueAddress = crimeListsService.formatAddress(searchResults['venue']['venueAddress']);
            res.render(`style-guide/${listType}`, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['style-guide'][listType]),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
                listData: listData,
                length: listData.length,
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                provenance: metaData.provenance,
                courtName: locationName,
                venueAddress: venueAddress,
            });
        } else if (
            searchResults === HttpStatusCode.NotFound ||
            metaData === HttpStatusCode.NotFound ||
            (!missingListType(metaDataListType) && !isValidListType(metaDataListType, listType))
        ) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
