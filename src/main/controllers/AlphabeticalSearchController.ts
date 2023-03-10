import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { FilterService } from '../service/filterService';

const filterService = new FilterService();

export default class AlphabeticalSearchController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const screenToRender = req.path.slice(1, req.path.length);
        const initialisedFilter = await filterService.handleFilterInitialisation(
            req.query?.clear as string,
            req.query?.filterValues as string,
            req.lng
        );

        res.render(screenToRender, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[screenToRender]),
            locationList: initialisedFilter['alphabetisedList'],
            filterOptions: initialisedFilter['filterOptions'],
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const screenToRender = req.path.slice(1, req.path.length);
        const filterValues = filterService.generateFilterKeyValues(req.body);
        res.redirect(`${screenToRender}?filterValues=${filterValues}`);
    }
}
