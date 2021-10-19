import { Request, Response} from 'express';
import { PipApi } from '../utils/PipApi';
import { CourtActions } from '../resources/actions/courtActions';
import { FilterService } from '../service/filterService';
import { CourtService } from '../service/courtService';

let _api: PipApi;
let courtActions;
const filterService = new FilterService();

export default class CourtNameSearchController {
  constructor(private readonly api: PipApi) {
    _api = this.api;
    courtActions = new CourtActions(_api);
  }
  
  public async get(req: Request, res: Response): Promise<void> {
    const alphabeticalCourts = await new CourtService(_api).generateCourtsAlphabetObject();
    const jurisdictionsList = await courtActions.getJurisdictionList();
    const regionsList = await courtActions.getRegionsList();
    const regionCheckboxes = filterService.generateCheckboxObjects(regionsList, [1]);
    const jurisdictionCheckboxes = filterService.generateCheckboxObjects(jurisdictionsList, []);
    const checkBoxesComponents = [
      filterService.generateCheckboxGroup(jurisdictionCheckboxes, 'Jurisdiction'),
      filterService.generateCheckboxGroup(regionCheckboxes, 'Region'),
    ];
    res.render('court-name-search', {alphabeticalCourts, checkBoxesComponents});
  }

  public async post(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    const courtsList = await courtActions.getCourtsList();
    res.render('court-name-search', {courtsList});
  }
}
