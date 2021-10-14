import { Request, Response } from 'express';

export default class SubscriptionAddController {
  public get(req: Request, res: Response): void {

    if (req.query.error === 'true') {
      res.render('subscription-add', {selectionError: true});
    } else {
      res.render('subscription-add');
    }

  }

  public post(req: Request, res: Response): void {
    switch(req.body['subscription-choice']) {
      case 'case-reference': {
        res.redirect('/');
        break;
      }
      case 'urn': {
        res.redirect('/');
        break;
      }
      case 'name': {
        res.redirect('/case-name-search');
        break;
      }
      case 'court-or-tribunal':
        res.redirect('/');
        break;
      default:
        res.redirect('/subscription-add?error=true');
    }
  }
}
