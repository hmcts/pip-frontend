import { Response} from 'express';
import { FilterService } from '../service/filterService';
import { CourtService } from '../service/courtService';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

const courtService = new CourtService();
const filterService = new FilterService();
let checkedRegionsFilter = [];
let checkedJurisdictionsFilter = [];

export default class CourtNameSearchController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    // remove filter selections
    if (req.query['clear']) {
      const clearValue = req.query['clear'];
      if (checkedJurisdictionsFilter.indexOf(clearValue) >= 0) {
        checkedJurisdictionsFilter.splice(checkedJurisdictionsFilter.indexOf(clearValue), 1);
      }

      if (checkedRegionsFilter.indexOf(clearValue) >= 0) {
        checkedRegionsFilter.splice(checkedRegionsFilter.indexOf(clearValue),1);
      }

      if (clearValue === 'all') {
        checkedJurisdictionsFilter = [];
        checkedRegionsFilter = [];
      }
    }

    let courtsList = [];
    await courtService.fetchAllCourts().then((courts) => {
      if (courts) {
        courtsList = courts;
      }
    });

    const alphabeticalCourts = await courtService.generateCourtsAlphabetObject(courtsList);
    const jurisdictionsList = await filterService.getDistinctValues('jurisdiction', courtsList);
    const regionsList = await filterService.getDistinctValues('location', courtsList);
    const regionCheckboxes = filterService.generateCheckboxObjects(regionsList, checkedRegionsFilter);
    const jurisdictionCheckboxes = filterService.generateCheckboxObjects(jurisdictionsList, checkedJurisdictionsFilter);
    const checkBoxesComponents = [
      filterService.generateCheckboxGroup(jurisdictionCheckboxes, 'Jurisdiction'),
      filterService.generateCheckboxGroup(regionCheckboxes, 'Region'),
    ];
    const categories = filterService.generateSelectedTags([{jurisdiction: checkedJurisdictionsFilter}, {location: checkedRegionsFilter}]);

    res.render('court-name-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['court-name-search']),
      alphabeticalCourts,
      checkBoxesComponents,
      categories,
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    if (req.body.jurisdiction) {
      checkedJurisdictionsFilter = Array.isArray(req.body.jurisdiction) ? req.body.jurisdiction : [req.body.jurisdiction];
    } else {
      checkedJurisdictionsFilter = [];
    }

    if (req.body.region) {
      checkedRegionsFilter = Array.isArray(req.body.region) ? req.body.region : [req.body.region];
    } else {
      checkedRegionsFilter = [];
    }

    const courtsList = await courtService.fetchAllCourts();
    const alphabeticalCourts = await courtService.generateCourtsAlphabetObject(courtsList);
    const jurisdictionsList = await filterService.getDistinctValues('jurisdiction', courtsList);
    const regionsList = await filterService.getDistinctValues('location', courtsList);
    const regionCheckboxes = filterService.generateCheckboxObjects(regionsList, checkedRegionsFilter);
    const jurisdictionCheckboxes = filterService.generateCheckboxObjects(jurisdictionsList, checkedJurisdictionsFilter);
    const checkBoxesComponents = [
      filterService.generateCheckboxGroup(jurisdictionCheckboxes, 'Jurisdiction'),
      filterService.generateCheckboxGroup(regionCheckboxes, 'Region'),
    ];

    const categories = filterService.generateSelectedTags([{jurisdiction: checkedJurisdictionsFilter}, {location: checkedRegionsFilter}]);

    res.render('court-name-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['court-name-search']),
      alphabeticalCourts,
      checkBoxesComponents,
      categories,
    });
  }
}
