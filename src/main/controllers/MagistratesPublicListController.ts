import {Response} from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import {PublicationService} from '../service/publicationService';
import {LocationService} from '../service/locationService';
import {ListParseHelperService} from '../service/listParseHelperService';
import {CrimeListsService} from '../service/listManipulation/CrimeListsService';
import { civilFamilyAndMixedListService } from '../service/listManipulation/civilFamilyAndMixedListService';

const publicationService = new PublicationService();
const locationService = new LocationService();
const helperService = new ListParseHelperService();
const crimeListsService = new CrimeListsService();
const civListsService = new civilFamilyAndMixedListService();

export default class MagistratesPublicListController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (searchResults && metaData) {
      let manipulatedData = civListsService.sculptedCivilFamilyMixedListData(JSON.stringify(searchResults));
      manipulatedData = crimeListsService.manipulatedCrimeListData(JSON.stringify(manipulatedData),
        req.lng as string, 'magistrates-public-list');

      const publishedTime = helperService.publicationTimeInBst(searchResults['document']['publicationDate']);
      const publishedDate = helperService.publicationDateInBst(searchResults['document']['publicationDate']);
      const location = await locationService.getLocationById(metaData['locationId']);
      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

      res.render('magistrates-public-list', {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)['magistrates-public-list']),
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
