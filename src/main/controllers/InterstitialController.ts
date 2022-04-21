import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import LaunchDarklyService from '../service/launchDarkly-service';
export default class InterstitialController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const currentLanguage = req?.lng ? req.lng : 'en';
    const toggleOFS = await LaunchDarklyService.getInstance().getVariation( 'sign-in-out-of-service', false);

    res.render('interstitial', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng).interstitial),
      currentLanguage,
      toggleOFS: toggleOFS,
    });
  }
}
