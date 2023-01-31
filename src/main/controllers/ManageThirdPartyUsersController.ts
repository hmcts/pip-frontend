import { PipRequest } from "../models/request/PipRequest";
import { Response } from "express";
import { cloneDeep } from "lodash";
import { ThirdPartyService } from "../service/thirdPartyService";

const thirdPartyService = new ThirdPartyService();

export default class ManageThirdPartyUsersController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    res.render("manage-third-party-users", {
      ...cloneDeep(
        req.i18n.getDataByLanguage(req.lng)["manage-third-party-users"]
      ),
      thirdPartyAccounts: await thirdPartyService.getThirdPartyAccounts(
        req.user["userId"]
      ),
    });
  }
}
