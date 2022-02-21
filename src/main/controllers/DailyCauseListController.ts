import {Response} from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import { PublicationsService } from '../service/publicationsService';

const publicationService = new PublicationsService();

export default class DailyCauseListControllerController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndivPubJson(artefactId, (!!req.user));
    const metaData = await publicationService.getIndivPubMetadata(artefactId, (!!req.user));

    if (searchResults && metaData) {
      publicationService.calculateHearingSessionTime(searchResults);

      const publishedDateTime = Date.parse(searchResults['document']['publicationDate']);

      res.render('daily-cause-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['daily-cause-list']),
        searchResults,
        contactDate: moment(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        publishedDate: moment(publishedDateTime).format('DD MMMM YYYY'),
        publishedTime: moment(publishedDateTime).format('ha'),
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
