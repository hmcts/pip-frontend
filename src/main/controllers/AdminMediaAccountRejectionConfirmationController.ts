import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import moment from 'moment';
import {cloneDeep} from 'lodash';
import {MediaAccountApplicationService} from '../service/mediaAccountApplicationService';
const mediaAccountApplicationService = new MediaAccountApplicationService();
export default class AdminMediaAccountRejectionConfirmationController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const applicantId = req.query['applicantId'];
    console.log('Requested data for the following id: ' + applicantId);
    if (applicantId) {
      const applicantData = await mediaAccountApplicationService.getApplicationById(applicantId);
      const imageFile = await mediaAccountApplicationService.getApplicationImageById(applicantData.image);
      applicantData['requestDate'] = moment(Date.parse(applicantData.requestDate)).format('DD MMMM YYYY');

      res.render('admin-media-account-rejection-confirmation', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['admin-media-account-rejection-confirmation']),
        applicantData: applicantData,
        image: imageFile,
      });
      return;
    }
    res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }

}
