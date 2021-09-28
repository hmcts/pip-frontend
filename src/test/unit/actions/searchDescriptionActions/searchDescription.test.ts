import { SearchDescriptionActions } from '../../../../main/resources/actions/searchDescriptionActions';

const searchDescriptionActions = new SearchDescriptionActions();

describe('getStatusDescriptionList()', () => {
  const results = searchDescriptionActions.getStatusDescriptionList();

  it('should return list of 49 courts events status', () => {
    expect(results.length).toBe(49);
  });
});

describe('First glossary should be Adjourned', () => {
  const results = searchDescriptionActions.getStatusDescriptionList();

  it('First glossary should be Adjourned', () => {
    expect(results[0].name).toEqual('Adjourned');
  });
});

describe('Description fof First glossary must not be empty', () => {
  const results = searchDescriptionActions.getStatusDescriptionList();

  it('Description fof First glossary must not be empty', () => {
    expect(results[0].description).not.toBeNull();
  });
});

describe('All Glossary items must have name and description', () => {
  const results = searchDescriptionActions.getStatusDescriptionList();

  it('All Glossary items must have name and description', () => {
    for (let i = 0; i < 49; i++) {
      expect(results[i].name).not.toBeNull();
      expect(results[i].description).not.toBeNull();
    }
  });
});
