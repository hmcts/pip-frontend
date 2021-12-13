import {cloneDeep} from 'lodash';

export default function validateRendering(searchResults, path, req, res, searchInput = null): void {
  searchResults ?
    res.render(path, {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[path]),
      searchInput,
      searchResults,
    }) :
    res.render('error', req.i18n.getDataByLanguage(req.lng).error);
}
