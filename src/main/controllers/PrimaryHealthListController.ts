import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { DataManipulationService } from '../service/dataManipulationService';
import moment from 'moment';

const publicationService = new PublicationService();
const dataManipulationService = new DataManipulationService();

export default class PrimaryHealthListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (searchResults && metaData) {

      // const manipulatedData = dataManipulationService.manipulatePrimaryHealthList(JSON.stringify(searchResults));

      dataManipulationService.manipulatePrimaryHealthList(JSON.stringify(searchResults));

      const publishedTime = dataManipulationService.publicationTimeInBst(searchResults['document']['publicationDate']);
      const publishedDate = dataManipulationService.publicationDateInBst(searchResults['document']['publicationDate']);

      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

      res.render('primary-health-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['primary-health-list']),
        contentDate: moment.utc(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        publishedDate: publishedDate,
        publishedTime: publishedTime,
        provenance: metaData['provenance'],
        bill: pageLanguage === 'bill',
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
