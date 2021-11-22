import {cloneDeep} from 'lodash';

export default function check(searchResults,path, req, res, searchInput) {
  if (searchResults) {
    res.render(path, {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[path]),
      searchInput : searchInput,
      searchResults: searchResults,
    });
  } else {
    res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }
}
