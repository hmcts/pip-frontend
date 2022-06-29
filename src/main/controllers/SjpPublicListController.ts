import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {PublicationService} from '../service/publicationService';

const publicationService = new PublicationService();

export default class SjpPublicListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    const fileData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (fileData && metaData) {
      const publishedTime = publicationService.publicationTimeInBst(fileData['document']['publicationDate']);
      const publishedDate = publicationService.publicationDateInBst(fileData['document']['publicationDate']);

      const data = fileData['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'];
      const length = data.length;
      res.render('single-justice-procedure', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['single-justice-procedure']),
        casesList: data,
        length: length,
        publishedDateTime: publishedDate,
        publishedTime: publishedTime,
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
