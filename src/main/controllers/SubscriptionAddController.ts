import { Response } from "express";
import { PipRequest } from "../models/request/PipRequest";
import { cloneDeep } from "lodash";

export default class SubscriptionAddController {
  public get(req: PipRequest, res: Response): void {
    if (req.query.error === "true") {
      res.render("subscription-add", {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)["subscription-add"]),
        selectionError: true,
      });
    } else {
      res.render(
        "subscription-add",
        req.i18n.getDataByLanguage(req.lng)["subscription-add"]
      );
    }
  }

  public post(req: PipRequest, res: Response): void {
    switch (req.body["subscription-choice"]) {
      case "case-reference": {
        res.redirect("/case-reference-number-search");
        break;
      }
      case "urn": {
        res.redirect("/subscription-urn-search");
        break;
      }
      case "name": {
        res.redirect("/case-name-search");
        break;
      }
      case "court-or-tribunal":
        res.redirect("/location-name-search");
        break;
      default:
        res.render("subscription-add", {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)["subscription-add"]),
          selectionError: true,
        });
    }
  }
}
