import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { ListDownloadService } from '../service/listDownloadService';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { cloneDeep } from 'lodash';
import { FileType } from '../models/consts';
import { PublicationService } from '../service/publicationService';
import { HttpStatusCode } from 'axios';

const url = 'list-download-files';
const listDownloadService = new ListDownloadService();
const publicationService = new PublicationService();

function getFiles(req, res, artefactId, type) {
    if (type === undefined) {
        const pdfFileSize = listDownloadService.getFileSize(artefactId, FileType.PDF);
        const excelFileSize = listDownloadService.getFileSize(artefactId, FileType.EXCEL);

        res.render(url, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[url]),
            artefactId: artefactId,
            pdfFileSize: pdfFileSize,
            excelFileSize: excelFileSize,
        });
    } else {
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

export default class ListDownloadFilesController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const type = req.query.type as string;
        const artefactId = req.query.artefactId;
        let publicationMetadata;

        if (artefactId) {
            publicationMetadata = await publicationService.getIndividualPublicationMetadata(
                artefactId,
                req.user['userId'],
                true
            );
            if (publicationMetadata && publicationMetadata !== HttpStatusCode.NotFound) {
                const isAuthorised = await listDownloadService.checkUserIsAuthorised(
                    req.user['userId'],
                    publicationMetadata.listType,
                    publicationMetadata.sensitivity
                );
                if (isAuthorised) {
                    getFiles(req, res, artefactId, type);
                } else {
                    res.render('unauthorised-access', req.i18n.getDataByLanguage(req.lng)['unauthorised-access']);
                }
            } else {
                res.render('list-not-found', req.i18n.getDataByLanguage(req.lng)['list-not-found']);
            }
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
