import { Request, Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';

export default class SearchOptionController {
  public get(req: PipRequest, res: Response): void {
    res.render('search-option', req.i18n.getDataByLanguage(req.lng)['search-option']);
  }

  public post(req: Request, res: Response): void {
    if (req.body['find-choice'] === 'search') {
      res.redirect('search');
    }
    else if (req.body['find-choice'] === 'find') {
      res.redirect('alphabetical-search');
    }
    else {
      res.redirect('search-option');
    }
  }
}
