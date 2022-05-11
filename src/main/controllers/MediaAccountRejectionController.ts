import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {MediaAccountApplicationService} from '../service/mediaAccountApplicationService';
import {cloneDeep} from 'lodash';
import moment from 'moment';

const mediaAccountApplicationService = new MediaAccountApplicationService();

export default class MediaAccountRejectionController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const applicantId = req.query['applicantId'];
    console.log('Requested data for the following id: ' + applicantId);
    if (applicantId) {
      const applicantData = await mediaAccountApplicationService.getApplicationById(applicantId);
      if (applicantData.status != 'PENDING'){
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        return;
      }
      const imageFile = await mediaAccountApplicationService.getApplicationImageById(applicantData.image);
      applicantData['requestDate'] = moment(Date.parse(applicantData.requestDate)).format('DD MMMM YYYY'),

      res.render('media-account-rejection', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-rejection']),
        applicantData: applicantData,
        image: imageFile,
      });
      return;
    }
    res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }

  public async post(req: PipRequest, res: Response): Promise<void>{
    const applicantId = req.query['applicantId'];
    if (req.body['reject-confirmation'] == 'Yes') {
      const updateStatus = await mediaAccountApplicationService.updateApplicationStatus(applicantId, 'REJECTED');
      if (updateStatus != null && applicantId) {
        const applicantData = await mediaAccountApplicationService.getApplicationById(applicantId);
        const imageFile = await mediaAccountApplicationService.getApplicationImageById(applicantData.image);
        applicantData['requestDate'] = moment(Date.parse(applicantData.requestDate)).format('DD MMMM YYYY');

        res.render('media-account-rejection-confirmation', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-rejection-confirmation']),
          applicantData: applicantData,
          image: imageFile,
        });
        return;
      } else {
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
      }
    }
    else if(req.body['reject-confirmation'] == 'No'){
      res.redirect('media-account-review?applicantId='+applicantId);
    }
  }
}
