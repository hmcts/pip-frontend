import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';
import {FilterService} from '../service/filterService';

const filterService = new FilterService();

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
    const filterValues = filterService.generateFilterKeyValues(req.body);
    res.redirect('alphabetical-search?filterValues=' + filterValues);
  }
}
