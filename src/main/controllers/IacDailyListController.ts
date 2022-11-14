import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import moment from 'moment';
import { DataManipulationService } from '../service/dataManipulationService';

const publicationService = new PublicationService();
const dataManipulationService = new DataManipulationService();

export default class IacDailyListController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (searchResults && metaData) {
      const listData = dataManipulationService.manipulateIacDailyListData(JSON.stringify(searchResults));
      const publishedTime = dataManipulationService.publicationTimeInBst(searchResults['document']['publicationDate']);
      const publishedDate = dataManipulationService.publicationDateInBst(searchResults['document']['publicationDate']);
      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

      res.render('iac-daily-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['iac-daily-list']),
        listData: listData,
        contentDate: moment.utc(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        publishedDate: publishedDate,
        publishedTime: publishedTime,
        provenance: metaData['provenance'],
        bill: pageLanguage === 'bill',
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
