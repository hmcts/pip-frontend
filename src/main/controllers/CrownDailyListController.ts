import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { CrimeListsService } from '../service/listManipulation/CrimeListsService';
import { CivilFamilyAndMixedListService } from '../service/listManipulation/CivilFamilyAndMixedListService';

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

        if (searchResults && metaData) {
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
            const provenance = metaData['provenance'] == 'SNL' ? 'LIST_ASSIST' : metaData['provenance'];

            res.render('crown-daily-list', {
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['crown-daily-list']),
                ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['list-template']),
                listData: outputData,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                provenance: provenance,
                version: searchResults['document']['version'],
                courtName: location.name,
                bill: pageLanguage === 'bill',
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
