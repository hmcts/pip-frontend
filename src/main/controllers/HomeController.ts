import { Application } from 'express';

export default class HomeController {
  public get(req: Request, res: Application): void {
    res.render('home');
  }
}
