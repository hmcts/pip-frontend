import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {PublicationService} from '../service/publicationService';
import moment from 'moment';

const publicationService = new PublicationService();

export default class SjpPublicListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    const fileData = await publicationService.getIndividualPublicationJson(artefactId, (!!req.user));
    const data = fileData['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'];
    const publishedDateTime = Date.parse(fileData['document']['publicationDate']);
    const publishedTime = publicationService.publicationTime(fileData['document']['publicationDate']);

    const length = data.length;
    res.render('single-justice-procedure', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['single-justice-procedure']),
      casesList: data,
      length: length,
      publishedDateTime: moment(publishedDateTime).format('DD MMMM YYYY'),
      publishedTime: publishedTime,
    },
    );
  }
}
