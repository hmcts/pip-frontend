import {Response} from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';
import { DataManipulationService } from '../service/dataManipulationService';
import {CrownFirmListService} from '../service/listManipulation/crownFirmListService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const dataManipulationService = new DataManipulationService();
const firmListService = new CrownFirmListService();

export default class CrownFirmListController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const jsonData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (jsonData && metaData) {
      let outputData = dataManipulationService.manipulatedDailyListData(JSON.stringify(jsonData));
      outputData = firmListService.splitOutFirmListData(JSON.stringify(outputData), req.lng, 'crown-firm-list');
      const publishedTime = dataManipulationService.publicationTimeInBst(jsonData['document']['publicationDate']);
      const publishedDate = dataManipulationService.publicationDateInBst(jsonData['document']['publicationDate']);
      const location = await locationService.getLocationById(metaData['locationId']);
      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

      res.render('crown-firm-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['crown-firm-list']),
        listData: outputData,
        contentDate: moment.utc(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        publishedDate: publishedDate,
        publishedTime: publishedTime,
        provenance: metaData['provenance'],
        version: jsonData['document']['version'],
        courtName: location.name,
        bill: pageLanguage === 'bill',
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
