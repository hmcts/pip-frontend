import { Request, Response } from 'express';
import { StatusDescriptionService } from '../service/statusDescriptionService';

export default class StatusDescriptionController {
  public get(req: Request, res: Response): void {
    const alphabetObject = new StatusDescriptionService().generateStatusDescriptionObject();

    res.render('status-description', {
      statusList: alphabetObject,
    });
  }
}
