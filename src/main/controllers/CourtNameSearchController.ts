import { Response} from 'express';
import { FilterService } from '../service/filterService';
import { CourtService } from '../service/courtService';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { CourtRequests } from '../resources/requests/courtRequests';

const courtService = new CourtService();
const courtRequests = new CourtRequests();
const filterService = new FilterService();
let checkedRegionsFilter = [];
let checkedJurisdictionsFilter = [];

export default class CourtNameSearchController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    let allCourts = [];
    let courtsList: any[];

    await courtService.fetchAllCourts().then((courts) => {
      if (courts) {
        allCourts = courts;
      }
    });

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

    if (!checkedJurisdictionsFilter.length && !checkedRegionsFilter.length) {
      courtsList = allCourts;
    } else {
      const filters = [];
      if (checkedJurisdictionsFilter.length > 0) {
        filters.push('jurisdiction');
      }
      if (checkedRegionsFilter.length > 0) {
        filters.push('location');
      }
      courtsList = await courtRequests.getFilteredCourts(filters, [...checkedJurisdictionsFilter, ...checkedRegionsFilter]);
    }

    const alphabeticalCourts = await courtService.generateCourtsAlphabetObject(courtsList);
    const jurisdictionsList = await filterService.getDistinctValues('jurisdiction', allCourts);
    const regionsList = await filterService.getDistinctValues('location', allCourts);
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
    let allCourts = [];
    let courtsList: any[];
    await courtService.fetchAllCourts().then((courts) => {
      if (courts) {
        allCourts = courts;
      }
    });

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

    if (!checkedJurisdictionsFilter.length && !checkedRegionsFilter.length) {
      courtsList = allCourts;
    } else {
      const filters = [];
      if (checkedJurisdictionsFilter.length > 0) {
        filters.push('jurisdiction');
      }
      if (checkedRegionsFilter.length > 0) {
        filters.push('location');
      }
      courtsList = await courtRequests.getFilteredCourts(filters, [...checkedJurisdictionsFilter, ...checkedRegionsFilter]);
    }

    const alphabeticalCourts = await courtService.generateCourtsAlphabetObject(courtsList);
    const jurisdictionsList = await filterService.getDistinctValues('jurisdiction', allCourts);
    const regionsList = await filterService.getDistinctValues('location', allCourts);
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
