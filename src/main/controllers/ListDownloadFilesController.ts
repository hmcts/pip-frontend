import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { ListDownloadService } from '../service/listDownloadService';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { cloneDeep } from 'lodash';
import { FileType } from '../models/consts';
import { Logger } from '@hmcts/nodejs-logging';

const url = 'list-download-files';
const listDownloadService = new ListDownloadService();

const logger = Logger.getLogger('list-download');

export default class ListDownloadFilesController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const type = req.query.type as string;
        const artefactId = req.query.artefactId;

        if (type === undefined) {
            logger.info('*****(4)Display PDF and Excel link');
            const pdfFileSize = listDownloadService.getFileSize(artefactId, FileType.PDF);
            const excelFileSize = listDownloadService.getFileSize(artefactId, FileType.EXCEL);

            res.render(url, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[url]),
                artefactId: artefactId,
                pdfFileSize: pdfFileSize,
                excelFileSize: excelFileSize,
            });
        } else {
            logger.info('*****(5)Download file with type' + type);

            const file = listDownloadService.getFile(artefactId, FileType[type.toUpperCase()]);
            if (file) {
                const filename = path.basename(file);
                const mimetype = mime.lookup(file);

                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                res.setHeader('Content-type', mimetype);

                const filestream = fs.createReadStream(file);
                filestream.pipe(res);
            } else {
                res.render('error', req.i18n.getDataByLanguage(req.lng).error);
            }
        }
    }
}
