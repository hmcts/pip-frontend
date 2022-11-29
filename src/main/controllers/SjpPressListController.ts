import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import {PublicationService} from '../service/publicationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { SjpPressListService} from '../service/listManipulation/SjpPressListService';

const publicationService = new PublicationService();
const helperService = new ListParseHelperService();
const sjpPressListService = new SjpPressListService();

export default class SjpPressListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const sjpData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (sjpData && metaData) {

      const manipulatedData = sjpPressListService.formatSJPPressList(JSON.stringify(sjpData));

      const publishedTime = helperService.publicationTimeInUkTime(sjpData['document']['publicationDate']);
      const publishedDate = helperService.publicationDateInUkTime(sjpData['document']['publicationDate']);

      res.render('single-justice-procedure-press', {
        ...cloneDeep(req.i18n.getDataByLanguage(publicationService.languageToLoadPageIn(metaData.language,
          req.lng))['single-justice-procedure-press']),
        sjpData: manipulatedData,
        publishedDateTime: publishedDate,
        publishedTime: publishedTime,
        contactDate: moment.utc(Date.parse(metaData['contentDate'])).format('D MMMM YYYY'),
        artefactId: artefactId,
        user: req.user,
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
