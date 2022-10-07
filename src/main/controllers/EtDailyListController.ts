import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {PublicationService} from '../service/publicationService';
import { DataManipulationService } from '../service/dataManipulationService';
import {LocationService} from '../service/locationService';
import moment from 'moment/moment';

const publicationService = new PublicationService();
const locationService = new LocationService();
const dataManipulationService = new DataManipulationService();

export default class EtDailyListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    const fileData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (fileData && metaData) {
      const listData = dataManipulationService.reshapeEtDailyListData(JSON.stringify(fileData));

      const publishedTime = dataManipulationService.publicationTimeInBst(fileData['document']['publicationDate']);
      const publishedDate = dataManipulationService.publicationDateInBst(fileData['document']['publicationDate']);
      const returnedCourt = await locationService.getLocationById(metaData['locationId']);
      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);
      const courtName = locationService.findCourtName(returnedCourt, req.lng as string, 'et-daily-list');
      res.render('et-daily-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['et-daily-list']),
        listData,
        courtName,
        contentDate: moment.utc(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        region: returnedCourt.region,
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
