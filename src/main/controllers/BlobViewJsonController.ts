import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {PublicationService} from '../service/publicationService';
import {prettyPrintJson, FormatOptions} from 'pretty-print-json';
import {LocationService} from '../service/locationService';

const publicationService = new PublicationService();
const locationService = new LocationService();
export default class BlobViewJsonController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const artefactId = req.query['artefactId'];
    if (artefactId) {
      const listTypes = publicationService.getListTypes();
      const options: FormatOptions = {indent: 3, lineNumbers: true};
      const data = await publicationService.getIndividualPublicationJson(req.query['artefactId'], req.user?.['userId']);
      const jsonData: string = prettyPrintJson.toHtml(data, options);
      const metadata = await publicationService.getIndividualPublicationMetadata(req.query['artefactId'], req.user?.['userId']);
      const courtName = (await locationService.getLocationById(parseInt(metadata.locationId.toString()))).name;

      const listUrl = process.env.FRONTEND_URL + '/' + listTypes.get(metadata.listType)?.url + '?artefactId=' + artefactId;
      res.render('blob-view-json', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['blob-view-json']),
        data,
        courtName,
        artefactId,
        metadata,
        jsonData,
        listUrl,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
