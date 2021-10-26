import { Application } from 'express';
import {PipRequest} from '../models/request/PipRequest';

export default class HomeController {
  public get(req: PipRequest, res: Application): void {
    res.render('home', req.i18n.getDataByLanguage(req.lng).home);
  }
}
