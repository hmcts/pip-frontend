import {PipRequest} from '../models/request/PipRequest';
import { Response } from 'express';
import {cloneDeep} from 'lodash';
import {CourtService} from '../service/courtService';
import {SummaryOfPublicationsService} from '../service/summaryOfPublicationsService';

const summaryOfPublicationsService = new SummaryOfPublicationsService();
const courtService = new CourtService();

export default class SummaryOfPublicationsController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    //TODO we should link this up to the reference data endpoint when it's passed
    const courtId = req.query['courtId'];
    if (courtId) {
      const court = await courtService.getCourtById(parseInt(courtId.toString()));
      const courtName = (court == null ? 'Missing Court' : court.name);
      const publications = await summaryOfPublicationsService.getPublications(parseInt(courtId.toString()), (!!req.user));

      res.render('summary-of-publications', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['summary-of-publications']),
        publications,
        courtName,
      });

    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
