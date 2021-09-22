import { Request, Response } from 'express';
import { CourtService } from '../service/courtService';

export default class AlphabeticalSearchController {

  public get(req: Request, res: Response): void{
    const alphabetObject = new CourtService().generateCourtsObject();

    res.render('alphabetical-search', {
      courtList: alphabetObject,
    });
  }

}
