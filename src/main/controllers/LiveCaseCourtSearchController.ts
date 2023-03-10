import { Response } from 'express';
import { LocationService } from '../service/locationService';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

const courtService = new LocationService();

export default class LiveCaseCourtSearchController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const crownCourts = await courtService.generateAlphabetisedCrownCourtList(req.lng);
        res.render('live-case-alphabet-search', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['live-case-alphabet-search']),
            courtList: crownCourts,
        });
    }
}
