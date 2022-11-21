import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {PublicationService} from '../service/publicationService';
import {DataManipulationService} from '../service/dataManipulationService';

const publicationService = new PublicationService();
const dataManipulationService = new DataManipulationService();

export default class SjpPublicListController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    const fileData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (fileData && metaData) {
      const publishedTime = dataManipulationService.publicationTimeInBst(fileData['document']['publicationDate']);
      const publishedDate = dataManipulationService.publicationDateInBst(fileData['document']['publicationDate']);
      const casesCount = SjpPublicListController.getCasesCount(fileData);

      res.render('single-justice-procedure', {
        ...cloneDeep(req.i18n.getDataByLanguage(publicationService.languageToLoadPageIn(metaData.language,
          req.lng))['single-justice-procedure']),
        sjpData: fileData,
        length: casesCount,
        publishedDateTime: publishedDate,
        publishedTime: publishedTime,
        artefactId: artefactId,
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }

  private static getCasesCount(sjpData: object): number {
    let totalCases = 0;
    sjpData['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['sittings'].forEach(sitting => {
            totalCases += sitting['hearing'].length;
          });
        });
      });
    });
    return totalCases;
  }
}
