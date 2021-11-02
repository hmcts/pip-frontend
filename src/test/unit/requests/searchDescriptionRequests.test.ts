import {SearchDescriptionRequests} from '../../../main/resources/requests/searchDescriptionRequests';

const searchDescriptionRequests = new SearchDescriptionRequests();

describe('getStatusDescriptionList()', () => {

  it('should return list of 49 courts events status', () => {
    return searchDescriptionRequests.getStatusDescriptionList().then(data => {
      expect(data.length).toBe(49);
    });
  });

  it('First glossary should be Adjourned', () => {
    return searchDescriptionRequests.getStatusDescriptionList().then(data => {
      expect(data[0].eventName).toStrictEqual('Adjourned');
    });
  });

  it('Description fof First glossary must not be empty', () => {
    return searchDescriptionRequests.getStatusDescriptionList().then(data => {
      expect(data[0].eventStatus).not.toBeNull();
    });
  });

  let i = 0;
  it('All Glossary items must have name and description', () => {
    return searchDescriptionRequests.getStatusDescriptionList().then(data => {
      expect(data[i].eventName).not.toBeNull();
      expect(data[i].eventStatus).not.toBeNull();
      i++;
    });
  });

});
