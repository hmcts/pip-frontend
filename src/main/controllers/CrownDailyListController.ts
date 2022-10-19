import {Response} from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';
import { DataManipulationService } from '../service/dataManipulationService';
import {CrownDailyListService} from '../service/listManipulation/crownDailyListService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const dataManipulationService = new DataManipulationService();
const crownDailyListService = new CrownDailyListService();

export default class CrownDailyListController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (searchResults && metaData) {

      let manipulatedData = dataManipulationService.manipulatedDailyListData(JSON.stringify(searchResults));
      manipulatedData = crownDailyListService.manipulatedCrownDailyListData(JSON.stringify(manipulatedData),
        req.lng as string, 'crown-daily-list');
      manipulatedData = crownDailyListService.findUnallocatedCasesInCrownDailyListData(JSON.stringify(manipulatedData));

      const publishedTime = dataManipulationService.publicationTimeInBst(searchResults['document']['publicationDate']);
      const publishedDate = dataManipulationService.publicationDateInBst(searchResults['document']['publicationDate']);
      const location = await locationService.getLocationById(metaData['locationId']);
      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

      res.render('crown-daily-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['crown-daily-list']),
        listData: manipulatedData,
        contentDate: moment.utc(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        publishedDate: publishedDate,
        publishedTime: publishedTime,
        provenance: metaData['provenance'],
        version: searchResults['document']['version'],
        courtName: location.name,
        bill: pageLanguage === 'bill',
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
