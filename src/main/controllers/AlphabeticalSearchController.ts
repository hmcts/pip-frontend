import { Response } from 'express';
import { CourtService } from '../service/courtService';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import {FilterService} from '../service/filterService';

const courtService = new CourtService();
const filterService = new FilterService();

let keys = [];
let filterValues = [];
const filterNames = ['Type of court or tribunal', 'Region'];

export default class AlphabeticalSearchController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    if (req.query['clear']) {
      const query = req.query['clear'] as string;
      filterValues = filterService.handleFilterClear(filterValues, query);
    } else {
      filterValues = [];
    }
    const filterOptions = filterService.buildFilterValueOptions(await courtService.fetchAllCourts(), filterValues);

    let filters ={};
    if(filterValues.length > 0) {
      filters = filterService.findAndSplitFilters(filterValues, filterOptions);
    }

    const alphabetisedList = filterValues.length == 0 ? await courtService.generateAlphabetisedAllCourtList() :
      await courtService.generateFilteredAlphabetisedCourtList(filters[filterNames[1]], filters[filterNames[0]]);

    res.render('alphabetical-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['alphabetical-search']),
      courtList: alphabetisedList,
      filterOptions: filterOptions,
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const body = req.body;
    keys = Object.keys(body);

    const filters = filterService.splitFilters(filterNames, body);

    const values = [];
    keys.forEach(key => values.push(body[key]));
    filterValues = Array.prototype.concat.apply([], values);

    const alphabetisedList = await courtService.generateFilteredAlphabetisedCourtList(filters[filterNames[1]], filters[filterNames[0]]);
    const filterOptions = filterService.buildFilterValueOptions(await courtService.fetchAllCourts(), filterValues);

    res.render('alphabetical-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['alphabetical-search']),
      courtList: alphabetisedList,
      filterOptions: filterOptions,
    });
  }
}
