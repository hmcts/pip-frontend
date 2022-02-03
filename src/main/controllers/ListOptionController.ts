//TODO: To be deleted post UAT, this is a UAT solution only

import {PipRequest} from '../models/request/PipRequest';
import { Response } from 'express';
import {cloneDeep} from 'lodash';
import { PublicationService } from '../service/publicationService';

const publicationService = new PublicationService();

export default class ListOptionController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const courtId = req.query['courtId'];
    if (courtId) {
      const publications = await publicationService.getPublications(parseInt(courtId.toString()));
      if (req.user) {
        if (publications.length === 1){
          res.send('Hi there, there\'s only one publication so you\'ve been directed here');
        }
        else {
          res.render('summary-of-publications', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['summary-of-publications']),
            publications,
            courtName: courtId,
          });
        }
      } else {
        res.redirect(`hearing-list?courtId=${courtId}`);
      }
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
