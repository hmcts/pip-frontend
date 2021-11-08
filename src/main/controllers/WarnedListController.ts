import {PipRequest} from '../models/request/PipRequest';
import { Response } from 'express';

export default class WarnedListController {

  public get(req: PipRequest, res: Response): void {
    res.render('warned-list');
  }
}
