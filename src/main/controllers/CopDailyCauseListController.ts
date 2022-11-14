import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';
import moment from 'moment';
import { DataManipulationService } from '../service/dataManipulationService';

const publicationService = new PublicationService();
const courtService = new LocationService();
const dataManipulationService = new DataManipulationService();

export default class CopDailyCauseListController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (searchResults && metaData) {
      const manipulatedData = dataManipulationService.manipulateCopDailyCauseList(JSON.stringify(searchResults));

      const publishedTime = dataManipulationService.publicationTimeInBst(searchResults['document']['publicationDate']);
      const publishedDate = dataManipulationService.publicationDateInBst(searchResults['document']['publicationDate']);

      const returnedCourt = await courtService.getLocationById(metaData['locationId']);
      const courtName = courtService.findCourtName(returnedCourt, req.lng as string, 'cop-daily-cause-list');
      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

      const regionalJoh = dataManipulationService.getRegionalJohFromLocationDetails(searchResults['locationDetails']);

      res.render('cop-daily-cause-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['cop-daily-cause-list']),
        listData: manipulatedData,
        contentDate: moment.utc(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        publishedDate: publishedDate,
        publishedTime: publishedTime,
        courtName: courtName,
        regionalJoh: regionalJoh,
        provenance: metaData['provenance'],
        bill: pageLanguage === 'bill',
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
