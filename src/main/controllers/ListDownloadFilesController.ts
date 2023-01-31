import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { ListDownloadService } from '../service/listDownloadService';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { cloneDeep } from 'lodash';

const url = 'list-download-files';
const listDownloadService = new ListDownloadService();

export default class ListDownloadFilesController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const type = req.query.type;
        const artefactId = req.query.artefactId;

        if (type === undefined) {
            const response = await listDownloadService.generateFiles(artefactId);
            if (response) {
                const pdfFileSize = listDownloadService.getFileSize(artefactId, 'pdf');
                const excelFileSize = listDownloadService.getFileSize(artefactId, 'excel');

                res.render(url, {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[url]),
                    artefactId: artefactId,
                    pdfFileSize: pdfFileSize,
                    excelFileSize: excelFileSize,
                });
            } else {
                res.render('error', req.i18n.getDataByLanguage(req.lng).error);
            }
        } else {
            const file = listDownloadService.getFile(artefactId, type);
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
