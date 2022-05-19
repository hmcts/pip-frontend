import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import {PublicationService} from '../service/publicationService';
import {UserService} from '../service/userService';

const publicationService = new PublicationService();
const userService = new UserService();

export default class SjpPressListController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const sjpData = await publicationService.getIndividualPublicationJson(artefactId, (!!req.user));
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, (!!req.user));

    if (sjpData && metaData) {

      if(!await userService.isAuthorisedToViewListByAzureUserId(req.user, metaData.listType)) {
        res.render('error',
          req.i18n.getDataByLanguage(req.lng).error);
      }

      const publishedDateTime = Date.parse(sjpData['document']['publicationDate']);

      const manipulatedData = publicationService.formatSJPPressList(JSON.stringify(sjpData));

      res.render('single-justice-procedure-press', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['single-justice-procedure-press']),
        sjpData: manipulatedData,
        publishedDateTime: moment(publishedDateTime).format('D MMMM YYYY [at] h:mm a'),
        contactDate: moment(Date.parse(metaData['contentDate'])).format('D MMMM YYYY'),
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
