import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class InterstitialController {
  public get(req: PipRequest, res: Response): void {
    const currentLanguage = (req.cookies['i18next']) ? req.cookies['i18next'] : 'en';
    res.render('interstitial', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng).interstitial),
      currentLanguage,
    });
  }
}
