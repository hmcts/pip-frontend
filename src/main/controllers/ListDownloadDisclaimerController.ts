import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { Logger } from '@hmcts/nodejs-logging';

const disclaimerUrl = 'list-download-disclaimer';
const downloadFilesUrl = 'list-download-files';

const logger = Logger.getLogger('list-download');

export default class ListDownloadDisclaimerController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        logger.info('*****(2)Display disclaimer page');
        res.render(disclaimerUrl, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[disclaimerUrl]),
            artefactId: req.query.artefactId,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId;

        logger.info('*****(3)Submit disclaimer option');

        if (req.body['disclaimer-agreement'] === undefined) {
            return res.render(disclaimerUrl, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[disclaimerUrl]),
                noAgreementError: true,
                artefactId: artefactId,
            });
        } else {
            res.redirect(`${downloadFilesUrl}?artefactId=${artefactId}`);
        }
    }
}
