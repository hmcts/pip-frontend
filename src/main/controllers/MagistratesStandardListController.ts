import {Response} from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import { PublicationService } from '../service/publicationService';
import { LocationService } from '../service/locationService';
import { ListParseHelperService } from '../service/listParseHelperService';
import { MagistratesStandardListService } from '../service/listManipulation/magistratesStandardListService';
import { civilFamilyAndMixedListService } from '../service/listManipulation/civilFamilyAndMixedListService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const magsStandardListService = new MagistratesStandardListService();
const civService = new civilFamilyAndMixedListService();

export default class MagistratesStandardListController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (searchResults && metaData) {

      let manipulatedData = civService.sculptedCivilFamilyMixedListData(JSON.stringify(searchResults));
      manipulatedData = magsStandardListService.manipulatedMagsStandardListData(manipulatedData, req.lng as string, 'magistrates-standard-list');
      const publishedTime = helperService.publicationTimeInBst(searchResults['document']['publicationDate']);
      const publishedDate = helperService.publicationDateInBst(searchResults['document']['publicationDate']);
      const location = await locationService.getLocationById(metaData['locationId']);
      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

      res.render('magistrates-standard-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['magistrates-standard-list']),
        listData: manipulatedData,
        contentDate: moment.utc(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
        publishedDate: publishedDate,
        publishedTime: publishedTime,
        provenance: metaData['provenance'],
        version: searchResults['document']['version'],
        courtName: location.name,
        bill: pageLanguage === 'bill',
      });
    } else {
      res.render('error',
        req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
