import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';

const {cacheGet, cacheSet} = require('../cacheManager');

export default class MockSessionController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    console.log('get user', await cacheGet('userDetails'));
    const cachedUser = await cacheGet('userDetails');

    const userQuery = req.query.user;
    let userSet = false;
    if (userQuery === 'reset') {
      // reset session
      cacheSet('userDetails', null);
      res.render('session-management', {haveUser: userSet});
    } else {
      // if userSet check in the session
      if (cachedUser) {
        const userDetails = JSON.parse(cachedUser);
        console.log('userDetails', userDetails);
        userSet = true;
        res.render('session-management', {haveUser: userSet, userDetails});
      } else {
        res.render('session-management', {haveUser: userSet});
      }
    }
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const userName = req.body['user-name'];
    const userId = req.body['user-id'];
    const userType = req.body['user-type'];
    console.log('sessionConfig', req.body);
    if (userName && userId && userType) {
      // set data and redirect to subscription management
      console.log('setting user in the session');
      cacheSet('userDetails', JSON.stringify(req.body));
      res.redirect('subscription-management');
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}

