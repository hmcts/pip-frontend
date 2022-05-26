import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {PublicationService} from '../service/publicationService';
import {UserService} from '../service/userService';

const publicationService = new PublicationService();
const userService = new UserService();

export default class SjpPublicListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    const userId = await userService.getPandIUserId('PI_AAD', req.user);
    const fileData = await publicationService.getIndividualPublicationJson(artefactId, userId);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, userId);

    if (fileData && metaData) {

      const data = fileData['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'];
      const length = data.length;
      res.render('single-justice-procedure', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['single-justice-procedure']),
        casesList: data,
        length: length,
        date: fileData['document'].publicationDate,
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
