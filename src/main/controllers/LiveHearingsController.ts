import { Request, Response } from 'express';

export default class LiveHearingsController {

  public get(req: Request, res: Response): void{

    res.render('live-hearings', {
      courtList: [],
    });
  }

}
