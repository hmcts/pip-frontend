import {Response} from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';

const publicationService = new PublicationService();
const courtService = new LocationService();

export default class DailyCauseListController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const listToLoad = req.path.slice(1, req.path.length);
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (searchResults && metaData) {

      const manipulatedData = publicationService.manipulatedDailyListData(JSON.stringify(searchResults));

      const publishedTime = publicationService.publicationTimeInBst(searchResults['document']['publicationDate']);
      const publishedDate = publicationService.publicationDateInBst(searchResults['document']['publicationDate']);

      const court = await courtService.getLocationById(metaData['locationId']);

      res.render(listToLoad, {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[listToLoad]),
        listData: manipulatedData,
        contactDate: moment.utc(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        publishedDate: publishedDate,
        publishedTime: publishedTime,
        provenance: metaData['provenance'],
        courtName: court.name,
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
