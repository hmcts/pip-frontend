import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {MediaAccountApplicationService} from '../service/mediaAccountApplicationService';
import {cloneDeep} from 'lodash';
import {allowedImageTypeMappings} from '../models/consts';

const mediaAccountApplicationService = new MediaAccountApplicationService();

export default class AdminMediaAccountRejectionController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const applicantId = req.query['applicantId'];
    console.log('Requested data for the following id: '+applicantId);
    if (applicantId) {
      const applicantData = await mediaAccountApplicationService.getApplicationById(applicantId);

      res.render('admin-media-account-rejection', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['admin-media-account-rejection']),
        applicantData: applicantData,
      });
      return;
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
  }
}
