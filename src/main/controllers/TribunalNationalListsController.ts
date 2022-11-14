import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';
import { DataManipulationService } from '../service/dataManipulationService';
import { TribunalNationalListsService } from '../service/listManipulation/tribunalNationalListsService';
import moment from 'moment';

const publicationService = new PublicationService();
const dataManipulationService = new DataManipulationService();
const tribunalNationalListsService = new TribunalNationalListsService();

export default class TribunalNationalListsController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const listToLoad = req.path.slice(1, req.path.length);
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (searchResults && metaData) {
      const manipulatedData = tribunalNationalListsService.manipulateData(
        JSON.stringify(searchResults),
        req.lng as string,
        listToLoad
      );

      const publishedTime = dataManipulationService.publicationTimeInBst(searchResults['document']['publicationDate']);
      const publishedDate = dataManipulationService.publicationDateInBst(searchResults['document']['publicationDate']);

      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

      res.render(listToLoad, {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)[listToLoad]),
        contentDate: moment.utc(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        listData: manipulatedData,
        publishedDate: publishedDate,
        publishedTime: publishedTime,
        provenance: metaData['provenance'],
        bill: pageLanguage === 'bill',
        venueEmail: searchResults['venue']['venueContact']['venueEmail'],
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
