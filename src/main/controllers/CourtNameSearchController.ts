import { Response} from 'express';
import { FilterService } from '../service/filterService';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

const filterService = new FilterService();

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
    const filterValues = filterService.generateFilterKeyValues(req.body);
    res.redirect('court-name-search?filterValues=' + filterValues);
  }
}
