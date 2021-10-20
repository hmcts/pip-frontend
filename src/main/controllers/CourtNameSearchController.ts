import { Request, Response} from 'express';
import { PipApi } from '../utils/PipApi';
import { CourtActions } from '../resources/actions/courtActions';
import { FilterService } from '../service/filterService';
import { CourtService } from '../service/courtService';

let _api: PipApi;
let courtActions;
const filterService = new FilterService();
let checkedRegionsFilter;
let checkedJurisdictionsFilter;

export default class CourtNameSearchController {
  constructor(private readonly api: PipApi) {
    _api = this.api;
    courtActions = new CourtActions(_api);
    checkedJurisdictionsFilter = [];
    checkedRegionsFilter = [];
  }
  
  public async get(req: Request, res: Response): Promise<void> {
    if (req.query['clear'] === 'all') {
      checkedJurisdictionsFilter = [];
      checkedRegionsFilter = [];
    }
    const alphabeticalCourts = await new CourtService(_api).generateCourtsAlphabetObject();
    const jurisdictionsList = await courtActions.getJurisdictionList();
    const regionsList = await courtActions.getRegionsList();
    const regionCheckboxes = filterService.generateCheckboxObjects(regionsList, checkedRegionsFilter);
    const jurisdictionCheckboxes = filterService.generateCheckboxObjects(jurisdictionsList, checkedJurisdictionsFilter);
    const checkBoxesComponents = [
      filterService.generateCheckboxGroup(jurisdictionCheckboxes, 'Jurisdiction'),
      filterService.generateCheckboxGroup(regionCheckboxes, 'Region'),
    ];
    res.render('court-name-search', {alphabeticalCourts, checkBoxesComponents});
  }

  public async post(req: Request, res: Response): Promise<void> {
    let alphabeticalCourts = await new CourtService(_api).generateCourtsAlphabetObject();

    if (req.body.jurisdiction) {
      checkedJurisdictionsFilter = Array.isArray(req.body.jurisdiction) ? req.body.jurisdiction : [req.body.jurisdiction];
    }
    if (req.body.region) {
      checkedRegionsFilter = Array.isArray(req.body.region) ? req.body.region : [req.body.region];
    }

    if(Object.keys(req.body).length === 0) {
      checkedJurisdictionsFilter = [];
      checkedRegionsFilter = [];
    }

    const courtsList = await courtActions.getCourtsList();
    const jurisdictionsList = await courtActions.getJurisdictionList();
    const regionsList = await courtActions.getRegionsList();
    const regionCheckboxes = filterService.generateCheckboxObjects(regionsList, checkedRegionsFilter);
    const jurisdictionCheckboxes = filterService.generateCheckboxObjects(jurisdictionsList, checkedJurisdictionsFilter);
    const checkBoxesComponents = [
      filterService.generateCheckboxGroup(jurisdictionCheckboxes, 'Jurisdiction'),
      filterService.generateCheckboxGroup(regionCheckboxes, 'Region'),
    ];

    alphabeticalCourts = filterService.filterObject(courtsList, alphabeticalCourts,
      [{jurisdiction: checkedJurisdictionsFilter}, {location: checkedRegionsFilter}]);
    res.render('court-name-search', {alphabeticalCourts, checkBoxesComponents});
  }
}
