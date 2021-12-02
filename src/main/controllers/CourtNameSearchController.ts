import { Response} from 'express';
import { FilterService } from '../service/filterService';
import { CourtService } from '../service/courtService';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

const courtService = new CourtService();
const filterService = new FilterService();
let keys = [];
let filterValues = [];

export default class CourtNameSearchController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    if (req.query['clear']) {
      const query = req.query['clear'] as string;
      filterValues = filterService.handleFilterClear(filterValues, query);
    }

    const filterOptions = filterService.buildFilterValueOptions(await courtService.fetchAllCourts(), filterValues);
    keys = filterService.handleKeys(filterOptions);
    const alphabetisedList = filterValues.length ? await courtService.generateFilteredAlphabetisedCourtList(keys, filterValues) :
      await courtService.generateAlphabetisedAllCourtList();

    res.render('court-name-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['court-name-search']),
      courtList: alphabetisedList,
      filterOptions,
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const body = req.body;
    keys = Object.keys(body);
    const values = [];

    keys.forEach(key => {
      values.push(body[key]);
      if (key === 'Region') {
        keys.splice(keys.indexOf(key), 1, 'Location');
      }
    });
    filterValues = Array.prototype.concat.apply([], values);

    const alphabetisedList = await courtService.generateFilteredAlphabetisedCourtList(keys, filterValues);
    const filterOptions = filterService.buildFilterValueOptions(await courtService.fetchAllCourts(), filterValues);

    res.render('court-name-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['court-name-search']),
      courtList: alphabetisedList,
      filterOptions,
    });
  }
}
