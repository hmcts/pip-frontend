import {PipRequest} from '../models/request/PipRequest';
import { Response } from 'express';
import { SummaryOfPublicationsService } from '../service/summaryOfPublicationsService';
import {cloneDeep} from 'lodash';
import moment from 'moment';

const publicationService = new SummaryOfPublicationsService();

export default class ListTypeController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    const metadata = await publicationService.getIndivPubMetadata(artefactId, (!!req.user));
    const fileData = await publicationService.getIndivPubJson(artefactId, (!!req.user));
    const fileJson = JSON.parse(JSON.stringify(fileData));
    if (metadata.listType === 'SJP_PUBLIC_LIST'){
      console.log(fileJson);
      const data = fileJson.courtLists[0].courtHouse.courtRoom[0].session[0].sittings;
      const length = data.length;
      res.render('single-justice-procedure', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['single-justice-procedure']),
        casesList: data,
        length: length,
        date: moment().format('dddd, MMMM Do YYYY [at] h:mm a'),

      },
      );
    }
    else {
      res.set('Content-Type', 'application/json');
      res.send(fileData);
    }
  }
}
