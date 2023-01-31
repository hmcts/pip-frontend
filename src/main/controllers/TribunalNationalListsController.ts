import { Response } from "express";
import { PipRequest } from "../models/request/PipRequest";
import { cloneDeep } from "lodash";
import { PublicationService } from "../service/publicationService";
import { ListParseHelperService } from "../service/listParseHelperService";
import { TribunalNationalListsService } from "../service/listManipulation/TribunalNationalListsService";

const publicationService = new PublicationService();
const helperService = new ListParseHelperService();
const tribunalNationalListsService = new TribunalNationalListsService();

export default class TribunalNationalListsController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const listToLoad = req.path.slice(1, req.path.length);
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(
      artefactId,
      req.user?.["userId"]
    );
    const metaData = await publicationService.getIndividualPublicationMetadata(
      artefactId,
      req.user?.["userId"]
    );

    if (searchResults && metaData) {
      const manipulatedData = tribunalNationalListsService.manipulateData(
        JSON.stringify(searchResults),
        req.lng as string,
        listToLoad
      );

      const publishedTime = helperService.publicationTimeInUkTime(
        searchResults["document"]["publicationDate"]
      );
      const publishedDate = helperService.publicationDateInUkTime(
        searchResults["document"]["publicationDate"],
        req.lng
      );

      const pageLanguage = publicationService.languageToLoadPageIn(
        metaData.language,
        req.lng
      );

      res.render(listToLoad, {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)[listToLoad]),
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)["list-template"]),
        contentDate: helperService.contentDateInUtcTime(
          metaData["contentDate"],
          req.lng
        ),
        listData: manipulatedData,
        publishedDate: publishedDate,
        publishedTime: publishedTime,
        provenance: metaData["provenance"],
        bill: pageLanguage === "bill",
        venueEmail: searchResults["venue"]["venueContact"]["venueEmail"],
      });
    } else {
      res.render("error", req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
