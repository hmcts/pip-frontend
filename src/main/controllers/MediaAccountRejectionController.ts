import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { MediaAccountApplicationService } from '../service/mediaAccountApplicationService';
import { cloneDeep } from 'lodash';

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
    const applicantId = req.body['applicantId'];
    const rejected = req.body['reject-confirmation'];

    const applicantData = await mediaAccountApplicationService.getApplicationByIdAndStatus(applicantId, 'PENDING');
    if (applicantData) {
      return MediaAccountRejectionController.applicationFoundFlow(req, res, rejected, applicantId, applicantData);
    }
    res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }

  /**
   * This handles the pages that render when submitting a rejection, if the applicant has been found.
   */
  private static applicationFoundFlow(req, res, rejected, applicantId, applicantData): Promise<void> {
    if (!rejected) {
      return res.render('media-account-rejection', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-rejection']),
        applicantData: applicantData,
        displayRadioError: true,
      });
    }

    if (rejected === 'Yes') {
      return MediaAccountRejectionController.rejectionFlow(req, res, applicantId, applicantData);
    } else {
      return res.redirect('/media-account-review?applicantId=' + applicantId);
    }
  }

  /**
   * This handles the pages that render if the user has selected 'Reject' on the screen.
   */
  private static async rejectionFlow(req, res, applicantId, applicantData): Promise<void> {
    if (await mediaAccountApplicationService.rejectApplication(applicantId, req.user?.['piUserId'])) {
      return res.render('media-account-rejection-confirmation', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-account-rejection-confirmation']),
        applicantData: applicantData,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
