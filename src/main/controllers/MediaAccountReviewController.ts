import {PipRequest} from '../models/request/PipRequest';
import {MediaAccountApplicationService} from '../service/mediaAccountApplicationService';
import {Response} from 'express';
import {allowedImageTypeMappings} from '../models/consts';

const mediaAccountApplicationService = new MediaAccountApplicationService();

export default class MediaAccountReviewController {

  public async getImage(req: PipRequest, res: Response): Promise<void> {
    const imageId = req.query['imageId'];
    const applicantId = req.query['applicantId'];
    const image = await mediaAccountApplicationService.getImageById(imageId);
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

    res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }

}
