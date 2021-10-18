import { Request, Response} from 'express';
import { PipApi } from '../utils/PipApi';
import { CourtActions } from '../resources/actions/courtActions';

let _api: PipApi;
let courtActions = new CourtActions(_api);

export default class CourtNameSearchController {
  constructor(private readonly api: PipApi) {
    _api = this.api;
    courtActions = new CourtActions(_api);
  }
  
  public async get(req: Request, res: Response): Promise<void> {
    const courtsList = await courtActions.getCourtsList();
    res.render('court-name-search', {courtsList});
  }

  public async post(req: Request, res: Response): Promise<void> {
    const courtsList = await courtActions.getCourtsList();
    res.render('court-name-search', {courtsList});
  }
}
