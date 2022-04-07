import {Response} from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import { PublicationService } from '../service/publicationService';
import { CourtService } from '../service/courtService';

const publicationService = new PublicationService();
const courtService = new CourtService();

export default class DailyCauseListControllerController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(artefactId, (!!req.user));
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, (!!req.user));

    if (searchResults && metaData) {
      publicationService.calculateHearingSessionTime(searchResults);

      const publishedDateTime = Date.parse(searchResults['document']['publicationDate']);

      const court = await courtService.getCourtById(metaData['courtId']);

      res.render('daily-cause-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['daily-cause-list']),
        searchResults,
        contactDate: moment(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        publishedDate: moment(publishedDateTime).format('DD MMMM YYYY'),
        publishedTime: moment(publishedDateTime).format('ha'),
        courtName: court.name,
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
