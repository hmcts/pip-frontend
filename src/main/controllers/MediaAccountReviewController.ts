import {PipRequest} from '../models/request/PipRequest';
import {MediaAccountApplicationService} from '../service/mediaAccountApplicationService';
import {Response} from 'express';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import {allowedImageTypeMappings} from '../models/consts';

const mediaAccountApplicationService = new MediaAccountApplicationService();

export default class MediaAccountReviewController {
  public async get(req: PipRequest, res: Response): Promise<void> {

    const applicantId = req.query['applicantId'];
    if (applicantId) {

      const applicantData = await mediaAccountApplicationService.getApplicationById(applicantId);
      if (applicantData && applicantData.status === 'PENDING') {

        applicantData['requestDate'] = moment(Date.parse(applicantData.requestDate)).format('DD MMMM YYYY'),

        res.render('media-account-review', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-review']),
          applicantData: applicantData,
        });
        return;
      }
    }

    res.render('error', req.i18n.getDataByLanguage(req.lng).error);

  }

  public async getImage(req: PipRequest, res: Response): Promise<void> {
    const imageId = req.query['imageId'];
    const applicantId = req.query['applicantId'];
    if (imageId && applicantId) {

      const image = await mediaAccountApplicationService.getApplicationImageById(imageId);
      const applicant = await mediaAccountApplicationService.getApplicationById(applicantId);
      if (image && applicant) {

        const imageName = applicant.imageName;
        const extension = imageName.substring(imageName.lastIndexOf('.') + 1, imageName.length);

        const contentType = allowedImageTypeMappings[extension];
        if (contentType) {
          res.set('Content-Disposition', 'inline;filename=' + imageName);
          res.set('Content-Type', contentType);
          res.send(image);
          return;
        }
      }
    }
    res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }

  public approve(req: PipRequest, res: Response): void {
    const applicantId = req.body['applicantId'];
    if (applicantId) {
      res.redirect('/admin-media-account-approval?applicantId=' + applicantId);
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }

  public reject(req: PipRequest, res: Response): void {
    const applicantId = req.body['applicantId'];
    if (applicantId) {
      res.redirect('/admin-media-account-rejection?applicantId=' + applicantId);
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }

}
