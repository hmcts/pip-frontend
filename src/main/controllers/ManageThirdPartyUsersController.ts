import {PipRequest} from "../models/request/PipRequest";
import {Response} from "express";

export default class ManageThirdPartyUsersController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    res.render('manage-third-party-users',
      req.i18n.getDataByLanguage(req.lng)['manage-third-party-users']);
  }
}
