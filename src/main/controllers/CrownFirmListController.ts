import {Response} from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';
import {CrownFirmListService} from '../service/listManipulation/crownFirmListService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { civilFamilyAndMixedListService } from '../service/listManipulation/CivilFamilyAndMixedListService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const firmListService = new CrownFirmListService();
const civilService = new civilFamilyAndMixedListService();

export default class CrownFirmListController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const jsonData = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['userId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['userId']);

    if (jsonData && metaData) {
      const outputData = civilService.sculptedCivilFamilyMixedListData(JSON.stringify(jsonData));
      const outputArray = firmListService.splitOutFirmListData(JSON.stringify(outputData), req.lng, 'crown-firm-list');
      const publishedTime = helperService.publicationTimeInUkTime(jsonData['document']['publicationDate']);
      const publishedDate = helperService.publicationDateInUkTime(jsonData['document']['publicationDate']);
      const location = await locationService.getLocationById(metaData['locationId']);
      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);
      const dates = firmListService.getSittingDates(outputArray);
      const startDate = moment.utc(dates[0]).tz('Europe/London').format('DD MMMM YYYY');
      const endDate = moment.utc(dates[dates.length -1]).tz('Europe/London').format('DD MMMM YYYY');

      res.render('crown-firm-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['crown-firm-list']),
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['list-template']),
        listData: outputData,
        startDate,
        endDate,
        allocated: outputArray,
        contentDate: moment.utc(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        publishedDate,
        publishedTime,
        provenance: metaData['provenance'],
        version: jsonData['document']['version'],
        courtName: location.name,
        bill: pageLanguage === 'bill',
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
