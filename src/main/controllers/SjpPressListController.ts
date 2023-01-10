import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {DateTime} from 'luxon';
import {PublicationService} from '../service/publicationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { SjpPressListService} from '../service/listManipulation/SjpPressListService';

const publicationService = new PublicationService();
const helperService = new ListParseHelperService();
const sjpPressListService = new SjpPressListService();

export default class SjpPressListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const sjpData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

    if (sjpData && metaData) {

      const manipulatedData = sjpPressListService.formatSJPPressList(JSON.stringify(sjpData));

      const publishedTime = helperService.publicationTimeInUkTime(sjpData['document']['publicationDate']);
      const publishedDate = helperService.publicationDateInUkTime(sjpData['document']['publicationDate'], req.lng);

      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

      res.render('single-justice-procedure-press', {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['single-justice-procedure-press']),
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['list-template']),
        sjpData: manipulatedData,
        publishedDateTime: publishedDate,
        publishedTime: publishedTime,
        contactDate: DateTime.fromISO(metaData['contentDate'], {zone: 'Europe/London'}).setLocale(req.lng).toFormat('d MMMM yyyy'),
        artefactId: artefactId,
        user: req.user,
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
