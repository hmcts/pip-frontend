import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/publicationService';
import { LocationService } from '../../service/locationService';
import { ListParseHelperService } from '../../service/listParseHelperService';
import { SscsDailyListService } from '../../service/listManipulation/SscsDailyListService';
import { HttpStatusCode } from 'axios';
import { isValidList } from '../../helpers/listHelper';

const publicationService = new PublicationService();
const courtService = new LocationService();
const helperService = new ListParseHelperService();
const sscsListService = new SscsDailyListService();

const sscsUrl = 'sscs-daily-list';
const sscsAdditonalHearingsUrl = 'sscs-daily-list-additional-hearings';
const sscsPath = `style-guide/${sscsUrl}`;
const sscsAdditonalHearingsPath = `style-guide/${sscsAdditonalHearingsUrl}`;

export default class SscsDailyListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

        if (isValidList(searchResults, metaData) && searchResults && metaData) {
            const manipulatedData = sscsListService.manipulateSscsDailyListData(JSON.stringify(searchResults));

            const publishedTime = helperService.publicationTimeInUkTime(searchResults['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                searchResults['document']['publicationDate'],
                req.lng
            );

            const returnedCourt = await courtService.getLocationById(metaData['locationId']);
            const courtName = courtService.findCourtName(returnedCourt, req.lng, sscsPath);
            const url = publicationService.getListTypes().get(metaData.listType).url;

            let languageResource = {
                ...req.i18n.getDataByLanguage(req.lng)[sscsPath],
                ...req.i18n.getDataByLanguage(req.lng)['list-template'],
                ...req.i18n.getDataByLanguage(req.lng)['open-justice-statement'],
            };

            if (url === sscsAdditonalHearingsUrl) {
                languageResource = {
                    ...cloneDeep(languageResource),
                    ...req.i18n.getDataByLanguage(req.lng)[sscsAdditonalHearingsPath],
                };
            }

            res.render(sscsPath, {
                ...cloneDeep(languageResource),
                listData: manipulatedData,
                contentDate: helperService.contentDateInUtcTime(metaData['contentDate'], req.lng),
                publishedDate: publishedDate,
                publishedTime: publishedTime,
                courtName: courtName,
                provenance: metaData.provenance,
            });
        } else if (searchResults === HttpStatusCode.NotFound || metaData === HttpStatusCode.NotFound) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
