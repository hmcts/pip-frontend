import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {PublicationService} from '../service/publicationService';
import { DataManipulationService } from '../service/dataManipulationService';

const publicationService = new PublicationService();
const dataManipulationService = new DataManipulationService();

export default class SjpPublicListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    const fileData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

    if (fileData && metaData) {
      const publishedTime = dataManipulationService.publicationTimeInBst(fileData['document']['publicationDate']);
      const publishedDate = dataManipulationService.publicationDateInBst(fileData['document']['publicationDate']);

      const data = fileData['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'];
      const length = data.length;
      res.render('single-justice-procedure', {
        ...cloneDeep(req.i18n.getDataByLanguage(publicationService.languageToLoadPageIn(metaData.language,
          req.lng))['single-justice-procedure']),
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
