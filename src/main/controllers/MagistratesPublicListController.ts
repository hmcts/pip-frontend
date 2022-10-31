import {Response} from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import {PublicationService} from '../service/publicationService';

const publicationService = new PublicationService();

export default class MagistratesPublicListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (searchResults && metaData) {

      // const manipulatedData = dataManipulationService.manipulateSscsDailyListData(JSON.stringify(searchResults));
      //
      // const publishedTime = dataManipulationService.publicationTimeInBst(searchResults['document']['publicationDate']);
      // const publishedDate = dataManipulationService.publicationDateInBst(searchResults['document']['publicationDate']);
      //
      // const returnedCourt = await courtService.getLocationById(metaData['locationId']);
      // const courtName = courtService.findCourtName(returnedCourt, req.lng as string, 'sscs-daily-list');
      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

      res.render('magistrates-public-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['magistrates-public-list']),
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
