import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';
import moment from 'moment';
import { ListParseHelperService } from '../service/listParseHelperService';
import { SscsDailyListService } from '../service/listManipulation/sscsDailyListService';

const publicationService = new PublicationService();
const courtService = new LocationService();
const helperService = new ListParseHelperService();
const sscsListService = new SscsDailyListService();

export default class SscsDailyListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (searchResults && metaData) {

      const manipulatedData = sscsListService.manipulateSscsDailyListData(JSON.stringify(searchResults));

      const publishedTime = helperService.publicationTimeInBst(searchResults['document']['publicationDate']);
      const publishedDate = helperService.publicationDateInBst(searchResults['document']['publicationDate']);

      const returnedCourt = await courtService.getLocationById(metaData['locationId']);
      const courtName = courtService.findCourtName(returnedCourt, req.lng as string, 'sscs-daily-list');
      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

      res.render('sscs-daily-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['sscs-daily-list']),
        listData: manipulatedData,
        contentDate: moment.utc(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
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
