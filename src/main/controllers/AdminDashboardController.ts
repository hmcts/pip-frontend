import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import {checkRoles, manualUploadRoles, mediaAccountCreationRoles, adminAccountCreationRoles} from "../authentication/adminAuthentication";
import {cloneDeep} from "lodash";

export default class AdminDashboardController {
  public get(req: PipRequest, res: Response): void {
    res.render('admin-dashboard', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['admin-dashboard']),
      displayUpload: checkRoles(req, manualUploadRoles),
      displayRemove: checkRoles(req, manualUploadRoles),
      displayMedia: checkRoles(req, mediaAccountCreationRoles),
      displayCreateAdmin: checkRoles(req, adminAccountCreationRoles),
    });
  }
}
