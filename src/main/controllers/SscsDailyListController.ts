import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { SscsDailyListService } from '../service/listManipulation/SscsDailyListService';

const publicationService = new PublicationService();
const courtService = new LocationService();
const helperService = new ListParseHelperService();
const sscsListService = new SscsDailyListService();

export default class SscsDailyListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

    if (searchResults && metaData) {

      const manipulatedData = sscsListService.manipulateSscsDailyListData(JSON.stringify(searchResults));

      const publishedTime = helperService.publicationTimeInUkTime(searchResults['document']['publicationDate']);
      const publishedDate = helperService.publicationDateInUkTime(searchResults['document']['publicationDate']);

      const returnedCourt = await courtService.getLocationById(metaData['locationId']);
      const courtName = courtService.findCourtName(returnedCourt, req.lng as string, 'sscs-daily-list');
      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

      res.render('sscs-daily-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['sscs-daily-list']),
        listData: manipulatedData,
        contentDate: helperService.contentDateInUtcTime(metaData['contentDate']),
        publishedDate: publishedDate,
        publishedTime: publishedTime,
        courtName: courtName,
        provenance: metaData['provenance'],
        bill: pageLanguage === 'bill',
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
