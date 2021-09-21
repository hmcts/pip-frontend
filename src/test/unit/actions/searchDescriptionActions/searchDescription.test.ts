import { SearchDescriptionActions } from '../../../../main/resources/actions/searchDescriptionActions';

const searchDescriptionActions = new SearchDescriptionActions();

describe('getStatusDescriptionList()', () => {
  const results = searchDescriptionActions.getStatusDescriptionList();

  it('should return list of 49 courts events status', () => {
    expect(results.length).toBe(49);
  });
});
