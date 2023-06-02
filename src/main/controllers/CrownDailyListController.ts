import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { CrimeListsService } from '../service/listManipulation/CrimeListsService';
import { CivilFamilyAndMixedListService } from '../service/listManipulation/CivilFamilyAndMixedListService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../helpers/listHelper';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const civFamMixedService = new CivilFamilyAndMixedListService();
const crimeListsService = new CrimeListsService();

export default class CrownDailyListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(searchResults, metaData) && searchResults && metaData) {
            // initial cleaning of data using mixed list service
            let outputData = civFamMixedService.sculptedCivilListData(JSON.stringify(searchResults));
            outputData = crimeListsService.manipulateCrimeListData(
                JSON.stringify(outputData),
                req.lng,
                'crown-daily-list'
            );
            outputData = crimeListsService.findUnallocatedCasesInCrownDailyListData(JSON.stringify(outputData));

            const publishedTime = helperService.publicationTimeInUkTime(searchResults['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                searchResults['document']['publicationDate'],
                req.lng
            );
            const location = await locationService.getLocationById(metaData['locationId']);
            const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

            res.render('crown-daily-list', {
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['crown-daily-list']),
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['list-template']),
                listData: outputData,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                provenance: metaData.provenance,
                version: searchResults['document']['version'],
                courtName: location.name,
                bill: pageLanguage === 'bill',
            });
        } else if (searchResults === HttpStatusCode.NotFound || metaData === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
