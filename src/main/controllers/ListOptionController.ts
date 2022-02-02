//TODO: To be deleted post UAT, this is a UAT solution only

import {PipRequest} from '../models/request/PipRequest';
import { Response } from 'express';
// import {CourtService} from '../service/courtService';
import {cloneDeep} from 'lodash';
import { PublicationService } from '../service/publicationService';

const publicationService = new PublicationService();

export default class ListOptionController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const courtId = req.query['courtId'];
    const publications = await publicationService.getPublications(parseInt(courtId.toString()));
    if (publications.length === 1){
      res.send("Only one file is found so you've been transported directly to it.");
      res.end();
    }
    if (courtId) {

      if (req.user) {
        res.render('summary-of-publications', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['summary-of-publications']),
          publications,
          courtName: courtId,
        });
      } else {
        res.redirect(`hearing-list?courtId=${courtId}`);
      }
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
