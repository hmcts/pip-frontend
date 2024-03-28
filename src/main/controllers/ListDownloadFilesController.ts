import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { ListDownloadService } from '../service/listDownloadService';
import { cloneDeep } from 'lodash';
import {fileTypeMappings, FileType} from '../models/consts';
import { PublicationService } from '../service/publicationService';
import { HttpStatusCode } from 'axios';
import * as stream from "stream";

const url = 'list-download-files';
const listDownloadService = new ListDownloadService();
const publicationService = new PublicationService();

async function getFileSizes(req, res, artefactId): Promise<void> {
    const pdfFileSize = await listDownloadService.getFileSize(artefactId, FileType.PDF);
    const excelFileSize = await listDownloadService.getFileSize(artefactId, FileType.EXCEL);

    res.render(url, {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[url]),
        artefactId: artefactId,
        pdfFileSize: pdfFileSize,
        excelFileSize: excelFileSize,
    });
}

async function downloadFile(req, res, artefactId, type): Promise<void> {
    const fileData = await listDownloadService.getFile(artefactId, req.user['userId'], FileType[type.toUpperCase()]);

    if (fileData) {
        const fileExtension = FileType[type.toUpperCase()];
        const fileName = `${artefactId}.${fileExtension}`;
        const contentType = fileTypeMappings[fileExtension];

        const  fileContents = Buffer.from(fileData, "base64");
        const readStream = new stream.PassThrough();
        readStream.end(fileContents);

        res.set('Content-disposition', 'attachment; filename=' + fileName);
        res.set('Content-Type', contentType);
        readStream.pipe(res);
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
                    if (type) {
                        await downloadFile(req, res, artefactId, type);
                    } else {
                        await getFileSizes(req, res, artefactId)
                    }
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
