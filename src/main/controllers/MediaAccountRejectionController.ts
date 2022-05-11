import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {MediaAccountApplicationService} from '../service/mediaAccountApplicationService';
import {cloneDeep} from 'lodash';
import moment from 'moment';

const mediaAccountApplicationService = new MediaAccountApplicationService();

export default class MediaAccountRejectionController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const applicantId = req.query['applicantId'];
    const applicantData = await mediaAccountApplicationService.getApplicationByIdAndStatus(applicantId, 'PENDING');

    if (applicantData) {
      res.render('media-account-rejection', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-rejection']),
        applicantData: applicantData,
      });
      return;
    }

    res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {

    const applicantId = req.query['applicantId'];
    const applicantData = await mediaAccountApplicationService.getApplicationByIdAndStatus(applicantId, 'PENDING');
    if (applicantData && req.body['reject-confirmation'] == 'Yes') {
      const updateStatus = await mediaAccountApplicationService.rejectApplication(applicantId);
      if (updateStatus != null && applicantId) {
        applicantData['requestDate'] = moment(Date.parse(applicantData.requestDate)).format('DD MMMM YYYY');

        res.render('media-account-rejection-confirmation', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-rejection-confirmation']),
          applicantData: applicantData,
        });
        return;
      } else {
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
      }
    } else if (req.body['reject-confirmation'] == 'No') {
      res.redirect('media-account-review?applicantId=' + applicantId);
    } else {
      return res.render('media-account-rejection', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-rejection']),
        applicantData: applicantData,
        displayRadioError: true,
      });
    }

  }
}
