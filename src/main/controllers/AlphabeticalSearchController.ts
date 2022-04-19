import { Response } from 'express';
import { CourtService } from '../service/courtService';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import {FilterService} from '../service/filterService';

const courtService = new CourtService();
const filterService = new FilterService();

let keys = [];

export default class AlphabeticalSearchController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    let filterValues = filterService.stripFilters(req.query?.filterValues as string);
    if (req.query['clear']) {
      const query = req.query['clear'] as string;
      filterValues = filterService.handleFilterClear(filterValues, query);
    } else {
      filterValues = filterService.stripFilters(req.query?.filterValues as string);
    }

    const filterOptions = filterService.buildFilterValueOptions(await courtService.fetchAllCourts(), filterValues);

    let filters ={};
    if(filterValues.length > 0) {
      filters = filterService.findAndSplitFilters(filterValues, filterOptions);
    }

    const alphabetisedList = filterValues.length == 0 ? await courtService.generateAlphabetisedAllCourtList() :
      await courtService.generateFilteredAlphabetisedCourtList(filters['Region'], filters['Jurisdiction']);

    res.render('alphabetical-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['alphabetical-search']),
      courtList: alphabetisedList,
      filterOptions: filterOptions,
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    let filterValues = [];
    const body = req.body;
    keys = Object.keys(body);

    const values = [];
    keys.forEach(key => values.push(body[key]));
    filterValues = Array.prototype.concat.apply([], values);

    res.redirect('alphabetical-search?filterValues=' + filterValues);
  }
}
