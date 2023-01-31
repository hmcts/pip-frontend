import { Response } from 'express';
import { CaseEventGlossaryService } from '../service/caseEventGlossaryService';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';

const caseEventGlossaryService = new CaseEventGlossaryService();

export default class CaseEventGlossaryController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const alphabetObject = await caseEventGlossaryService.generateCaseEventGlossaryObject();
        const locationId = req.query.locationId;

        res.render('case-event-glossary', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-event-glossary']),
            statusList: alphabetObject,
            locationId: locationId,
        });
    }
}
