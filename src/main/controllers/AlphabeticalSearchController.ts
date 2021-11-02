import { Response } from 'express';
import { CourtService } from '../service/courtService';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import {FilterService} from '../service/filterService';

const courtService = new CourtService();
const filterService = new FilterService();

let keys = [];
let filterValues = [];

export default class AlphabeticalSearchController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    if (req.query['clear']) {
      const query = req.query['clear'] as string;
      filterValues = filterService.handleFilterClear(filterValues, query);
    } else {
      filterValues = [];
    }
    const filterOptions = filterService.buildFilterValueOptions(await courtService.fetchAllCourts(), filterValues);

    keys = filterService.handleKeys(filterOptions, filterValues);

    const alphabetisedList = filterValues.length == 0 ? await courtService.generateAlphabetisedAllCourtList() :
      await courtService.generateFilteredAlphabetisedCourtList(keys, filterValues);

    res.render('alphabetical-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['alphabetical-search']),
      courtList: alphabetisedList,
      filterOptions: filterOptions,
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const body = req.body;
    keys = Object.keys(body);

    const values = [];
    keys.forEach(key => values.push(body[key]));
    filterValues = Array.prototype.concat.apply([], values);

    keys.forEach(key => {
      if (key === 'Region') {
        keys.splice(keys.indexOf(key), 1, 'Location');
      }
    });

    const alphabetisedList = await courtService.generateFilteredAlphabetisedCourtList(keys, filterValues);
    const filterOptions = filterService.buildFilterValueOptions(await courtService.fetchAllCourts(), filterValues);

    res.render('alphabetical-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['alphabetical-search']),
      courtList: alphabetisedList,
      filterOptions: filterOptions,
    });
  }
}
