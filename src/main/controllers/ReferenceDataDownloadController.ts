import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {LocationRequests} from '../resources/requests/locationRequests';

const locationRequests = new LocationRequests();
export default class ReferenceDataDownloadController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const returnedData = await locationRequests.getLocationsCsv(req.user?.['userId']);

    res.set('Content-Disposition', 'inline;filename=' + 'referenceData.csv');
    res.set('Content-Type', 'application/csv');
    res.send(returnedData);
  }
}
