import { PipRequest } from "../models/request/PipRequest";
import { Response } from "express";
import { cloneDeep } from "lodash";

import { AccountManagementRequests } from "../resources/requests/accountManagementRequests";

const accountManagementRequests = new AccountManagementRequests();

export default class DeleteUserController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const userId = req.query.id as string;
    const userData = await accountManagementRequests.getUserByUserId(
      userId,
      req.user["userId"]
    );
    res.render("delete-user", {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)["delete-user"]),
      userData,
      userId,
    });
  }
}
