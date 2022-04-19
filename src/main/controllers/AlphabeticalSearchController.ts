import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import {FilterService} from '../service/filterService';

const filterService = new FilterService();

let keys = [];

export default class AlphabeticalSearchController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const initialisedFilter = await filterService.handleFilterInitialisation(req.query?.clear as string, req.query?.filterValues as string);

    res.render('alphabetical-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['alphabetical-search']),
      courtList: initialisedFilter['alphabetisedList'],
      filterOptions: initialisedFilter['filterOptions'],
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
