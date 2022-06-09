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

      const publishedDateTime = Date.parse(searchResults['document']['publicationDate']);
      const publishedTime = publicationService.publicationTime(searchResults['document']['publicationDate']);

      const court = await courtService.getLocationById(metaData['locationId']);

      res.render(listToLoad, {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[listToLoad]),
        listData: manipulatedData,
        contentDate: moment(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        publishedDate: moment(publishedDateTime).format('DD MMMM YYYY'),
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
