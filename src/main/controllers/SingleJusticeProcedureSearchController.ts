import { Request, Response } from 'express';

export default class SingleJusticeProcedureSearchController {
  public get(req: Request, res: Response): void {
    res.render('single-justice-procedure-search');
  }
}
