import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import * as url from 'url';

const disclaimerUrl = 'list-download-disclaimer';
const downloadFilesUrl = 'list-download-files';

export default class ListDownloadDisclaimerController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render(disclaimerUrl, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[disclaimerUrl]),
            artefactId: req.query.artefactId,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const artefactId = req.query.artefactId as string;

        if (req.body['disclaimer-agreement'] === undefined) {
            return res.render(disclaimerUrl, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[disclaimerUrl]),
                noAgreementError: true,
                artefactId: artefactId,
            });
        } else {
            res.redirect(
                url.format({
                    pathname: downloadFilesUrl,
                    query: { artefactId: artefactId },
                })
            );
        }
    }
}
