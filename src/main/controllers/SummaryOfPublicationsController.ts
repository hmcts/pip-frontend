import {PipRequest} from '../models/request/PipRequest';
import { Response } from 'express';
import {cloneDeep} from 'lodash';
import {CourtService} from '../service/courtService';
import {SummaryOfPublicationsService} from '../service/summaryOfPublicationsService';
import fs from 'fs';
import path from 'path';

const urlLookup = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../modules/nunjucks/listUrlLookup.json'), 'utf-8'));
const summaryOfPublicationsService = new SummaryOfPublicationsService();
const courtService = new CourtService();

export default class SummaryOfPublicationsController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    //TODO we should link this up to the reference data endpoint when it's passed
    const locationId = req.query['locationId'];
    if (locationId) {
      const court = await courtService.getCourtById(parseInt(locationId.toString()));
      const courtName = (court == null ? 'Missing Court' : court.name);
      const publications = await summaryOfPublicationsService.getPublications(parseInt(locationId.toString()), (!!req.user));
      if (publications.length === 1){
        if (publications[0].isFlatFile){
          res.redirect(`file-publication?artefactId=${publications[0].artefactId}`);
        }
        else {
          res.redirect(`${urlLookup[publications[0].listType]}?artefactId=${publications[0].artefactId}`);
        }
      }
      else {
        res.render('summary-of-publications', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['summary-of-publications']),
          publications,
          courtName,
        });
      }
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
