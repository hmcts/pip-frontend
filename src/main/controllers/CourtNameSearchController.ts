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
      filterValues = filterService.handleFilterClear(filterValues, req.query['clear'] as string);
    } else {
      filterValues = filterService.stripFilters(req.query?.filterValues as string);
    }

    const filterOptions = filterService.buildFilterValueOptions(await courtService.fetchAllCourts(), filterValues);

    let filters ={};
    if(filterValues.length > 0) {
      filters = filterService.findAndSplitFilters(filterValues, filterOptions);
    }

    const alphabetisedList = filterValues.length ? await courtService.generateFilteredAlphabetisedCourtList(filters['Region'], filters['Jurisdiction']) :
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
    keys.forEach(key => values.push(body[key]));
    filterValues = Array.prototype.concat.apply([], values);

    res.redirect('court-name-search?filterValues=' + filterValues);
  }
}
