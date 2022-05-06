import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {MediaAccountApplicationService} from '../service/mediaAccountApplicationService';
import {cloneDeep} from 'lodash';

const mediaAccountApplicationService = new MediaAccountApplicationService();

export default class AdminMediaAccountRejectionController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const applicantId = req.query['applicantId'];
    const applicantData = await mediaAccountApplicationService.getApplicationById(applicantId);
    res.render('admin-media-account-rejection', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['admin-media-account-rejection']),
      applicantData: applicantData,
    },
    );
  }
}
