import { Request, Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';

export default class ViewOptionController {
  public get(req: PipRequest, res: Response): void {
    res.render('view-option', req.i18n.getDataByLanguage(req.lng)['view-option']);
  }

  public post(req: Request, res: Response): void {
    if (req.body['view-choice'] === 'search') {
      res.redirect('search');
    }
    else if (req.body['view-choice'] === 'live') {
      res.redirect('live-case-alphabet-search');
    }
    else if (req.body['view-choice'] === 'sjp') {
      res.redirect('publication?courtId=0');
    }
    else {
      res.redirect('view-option');
    }
  }
}
