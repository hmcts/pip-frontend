import { Request, Response } from 'express';
import { StatusDescriptionService } from '../service/statusDescriptionService';
import {PipApi} from '../utils/PipApi';

let _api: PipApi;

export default class StatusDescriptionController {

  constructor(private readonly api: PipApi) {
    _api = this.api;
  }
  public async get(req: Request, res: Response): Promise<void> {
    const alphabetObject = await new StatusDescriptionService(_api).generateStatusDescriptionObject();

    res.render('status-description', {
      statusList: alphabetObject,
    });
  }
}
