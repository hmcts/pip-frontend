import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/PublicationService';
import { LocationService } from '../../service/LocationService';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { CrimeListsService } from '../../service/listManipulation/CrimeListsService';
import { HttpStatusCode } from 'axios';
import { formatMetaDataListType, isUnexpectedListType, isValidList, isValidListType } from '../../helpers/listHelper';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const crimeListsService = new CrimeListsService();

const listUrl = 'crown-daily-list';
const listPath = `style-guide/${listUrl}`;

export default class CrownDailyListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const metadataListType = formatMetaDataListType(metaData);

        if (isValidList(searchResults, metaData) && isValidListType(metadataListType, listUrl)) {
            let outputData = crimeListsService.manipulateCrimeListData(
                JSON.stringify(searchResults),
                req.lng,
                listPath
            );

            outputData = crimeListsService.findUnallocatedCasesInCrownDailyListData(JSON.stringify(outputData));
            const venueAddress = crimeListsService.formatAddress(searchResults['venue']['venueAddress']);
            const publishedTime = helperService.publicationTimeInUkTime(searchResults['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                searchResults['document']['publicationDate'],
                req.lng
            );
            const location = await locationService.getLocationById(metaData['locationId']);

            res.render(listPath, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['style-guide'][listUrl]),
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['list-template']),
                listData: outputData,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                provenance: metaData.provenance,
                version: searchResults['document']['version'],
                courtName: location.name,
                venueAddress: venueAddress,
            });
        } else if (
            searchResults === HttpStatusCode.NotFound ||
            metaData === HttpStatusCode.NotFound ||
            isUnexpectedListType(metadataListType, listUrl)
        ) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
