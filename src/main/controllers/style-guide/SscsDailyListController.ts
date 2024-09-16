import { Response } from 'express';
import { PipRequest } from '../../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/PublicationService';
import { LocationService } from '../../service/LocationService';
import { ListParseHelperService } from '../../service/ListParseHelperService';
import { SscsDailyListService } from '../../service/listManipulation/SscsDailyListService';
import { HttpStatusCode } from 'axios';
import { formatMetaDataListType, isOneOfValidListTypes, isValidList, missingListType } from '../../helpers/listHelper';

const publicationService = new PublicationService();
const courtService = new LocationService();
const helperService = new ListParseHelperService();
const sscsListService = new SscsDailyListService();

const sscsUrl = 'sscs-daily-list';
const sscsAdditonalHearingsUrl = 'sscs-daily-list-additional-hearings';
const sscsPath = `style-guide/${sscsUrl}`;

export default class SscsDailyListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;
        const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
        const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);
        const metaDataListType = formatMetaDataListType(metaData);

        if (
            isValidList(searchResults, metaData) &&
            isOneOfValidListTypes(metaDataListType, sscsUrl, sscsAdditonalHearingsUrl)
        ) {
            const manipulatedData = sscsListService.manipulateSscsDailyListData(JSON.stringify(searchResults));

            const publishedTime = helperService.publicationTimeInUkTime(searchResults['document']['publicationDate']);
            const publishedDate = helperService.publicationDateInUkTime(
                searchResults['document']['publicationDate'],
                req.lng
            );

            const returnedCourt = await courtService.getLocationById(metaData['locationId']);
            const courtName = courtService.findCourtName(returnedCourt, req.lng, sscsUrl);
            const url = publicationService.getListTypes().get(metaData.listType).url;

            let languageResource = {
                ...req.i18n.getDataByLanguage(req.lng)[sscsUrl],
                ...req.i18n.getDataByLanguage(req.lng)['list-template'],
                ...req.i18n.getDataByLanguage(req.lng)['open-justice-statement'],
            };

            if (url === sscsAdditonalHearingsUrl) {
                languageResource = {
                    ...cloneDeep(languageResource),
                    ...req.i18n.getDataByLanguage(req.lng)[sscsAdditonalHearingsUrl],
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
        } else if (
            searchResults === HttpStatusCode.NotFound ||
            metaData === HttpStatusCode.NotFound ||
            (!missingListType(metaDataListType) &&
                !isOneOfValidListTypes(metaDataListType, sscsUrl, sscsAdditonalHearingsUrl))
        ) {
            res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
