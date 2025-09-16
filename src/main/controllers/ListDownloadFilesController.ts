import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { ListDownloadService } from '../service/ListDownloadService';
import { cloneDeep } from 'lodash';
import { fileTypeMappings, FileType } from '../helpers/consts';
import { PublicationService } from '../service/PublicationService';
import { HttpStatusCode } from 'axios';

const url = 'list-download-files';
const listDownloadService = new ListDownloadService();
const publicationService = new PublicationService();

async function getFileSizes(req, res, artefactId): Promise<void> {
    const pdfFileSize = await listDownloadService.getFileSize(artefactId, FileType.PDF, req.user['userId']);
    const excelFileSize = await listDownloadService.getFileSize(artefactId, FileType.EXCEL, req.user['userId']);

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

        res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        res.setHeader('Content-type', contentType);

        listDownloadService.handleFileDownload(res, Buffer.from(fileData, 'base64'));
    } else {
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
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
                        await downloadFile(req, res, publicationMetadata['artefactId'], type);
                    } else {
                        await getFileSizes(req, res, publicationMetadata['artefactId']);
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
