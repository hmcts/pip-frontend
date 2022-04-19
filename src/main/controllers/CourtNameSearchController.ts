import { Response} from 'express';
import { FilterService } from '../service/filterService';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

const filterService = new FilterService();
let keys = [];

export default class CourtNameSearchController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const initialisedFilter = await filterService.handleFilterInitialisation(req.query?.clear as string, req.query?.filterValues as string);

    res.render('court-name-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['court-name-search']),
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

    res.redirect('court-name-search?filterValues=' + filterValues);
  }
}
