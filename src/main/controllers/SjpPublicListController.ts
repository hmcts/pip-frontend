import { PipRequest } from "../models/request/PipRequest";
import { Response } from "express";
import { cloneDeep } from "lodash";
import { PublicationService } from "../service/publicationService";
import { ListParseHelperService } from "../service/listParseHelperService";

const publicationService = new PublicationService();
const helperService = new ListParseHelperService();

export default class SjpPublicListController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query["artefactId"];
    const fileData = await publicationService.getIndividualPublicationJson(
      artefactId,
      req.user?.["userId"]
    );
    const metaData = await publicationService.getIndividualPublicationMetadata(
      artefactId,
      req.user?.["userId"]
    );

    if (fileData && metaData) {
      const publishedTime = helperService.publicationTimeInUkTime(
        fileData["document"]["publicationDate"]
      );
      const publishedDate = helperService.publicationDateInUkTime(
        fileData["document"]["publicationDate"],
        req.lng
      );
      const casesCount = SjpPublicListController.getCasesCount(fileData);
      const pageLanguage = publicationService.languageToLoadPageIn(
        metaData.language,
        req.lng
      );

      res.render("single-justice-procedure", {
        ...cloneDeep(
          req.i18n.getDataByLanguage(pageLanguage)["single-justice-procedure"]
        ),
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)["list-template"]),
        sjpData: fileData,
        length: casesCount,
        publishedDateTime: publishedDate,
        publishedTime: publishedTime,
        artefactId: artefactId,
        user: req.user,
      });
    } else {
      res.render("error", req.i18n.getDataByLanguage(req.lng).error);
    }
  }

  private static getCasesCount(sjpData: object): number {
    let totalCases = 0;
    sjpData["courtLists"].forEach((courtList) => {
      courtList["courtHouse"]["courtRoom"].forEach((courtRoom) => {
        courtRoom["session"].forEach((session) => {
          session["sittings"].forEach((sitting) => {
            totalCases += sitting["hearing"].length;
          });
        });
      });
    });
    return totalCases;
  }
}
