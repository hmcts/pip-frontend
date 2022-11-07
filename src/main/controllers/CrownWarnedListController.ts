import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {PublicationService} from '../service/publicationService';
import {DataManipulationService} from '../service/dataManipulationService';
import {CrownWarnedListService} from '../service/listManipulation/crownWarnedListService';

const publicationService = new PublicationService();
const dataManipulationService = new DataManipulationService();
const crownWarnedListService = new CrownWarnedListService();

const listUrl = 'crown-warned-list';
const toBeAllocated = 'To be allocated';
const toBeAllocatedLowerCase = toBeAllocated.toLowerCase();

export default class CrownWarnedListController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query.artefactId as string;
    const searchResults = await publicationService.getIndividualPublicationJson(artefactId, req.user?.['piUserId']);
    const metaData = await publicationService.getIndividualPublicationMetadata(artefactId, req.user?.['piUserId']);

    if (searchResults && metaData) {
      const publishedTime = dataManipulationService.publicationTimeInBst(searchResults['document']['publicationDate']);
      const publishedDate = dataManipulationService.publicationDateInBst(searchResults['document']['publicationDate']);
      const pageLanguage = publicationService.languageToLoadPageIn(metaData.language, req.lng);

      const listData = crownWarnedListService.manipulateData(JSON.stringify(searchResults));

      // Sort unallocated list entry to the end of the map so it appears last on the template
      const sortedListData = new Map([...listData].sort(([a], [b]) =>
        toBeAllocatedLowerCase === a.toLowerCase() ? 1
          : toBeAllocatedLowerCase === b.toLowerCase() ? -1
          : 0));

      res.render(listUrl, {
        ...cloneDeep(req.i18n.getDataByLanguage(pageLanguage)[listUrl]),
        listData: sortedListData,
        venue: searchResults['venue'],
        contentDate: crownWarnedListService.formatContentDate(metaData.contentDate),
        publishedDate: publishedDate,
        publishedTime: publishedTime,
        version: searchResults['document']['version'],
        provenance: metaData.provenance,
        bill: pageLanguage === 'bill',
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
