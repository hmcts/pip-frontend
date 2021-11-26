import {cloneDeep} from 'lodash';

export default function validateRendering(searchResults,path, req, res, searchInput): void {
  if (searchResults) {
    res.render(path, {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[path]),
      searchInput,
      searchResults,
    });
  } else {
    res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }
}
