import { StatusDescriptionService } from '../../../main/service/statusDescriptionService';
import sinon from 'sinon';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import {SearchDescriptionRequests} from '../../../main/resources/requests/searchDescriptionRequests';

const statusDescriptionService = new StatusDescriptionService();

const searchDescriptionRequests = SearchDescriptionRequests.prototype;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/StatusDescription.json'), 'utf-8');
const statusDescriptionData = JSON.parse(rawData);

const stub = sinon.stub(searchDescriptionRequests, 'getStatusDescriptionList').returns(statusDescriptionData);
stub.withArgs().returns(statusDescriptionData);

const validStatusDescriptionKeysCount = 26;
const alphabet = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];
const validStatusDescription = 'Adjourned';
const invalidStatusDescription = 'Bench continue hearing';

describe('Status Description Service', () => {
  it(`should return object with ${validStatusDescriptionKeysCount} status description keys`, () => {
    return statusDescriptionService.generateStatusDescriptionObject().then((data) => {
      expect(Object.keys(data).length).to.equal(validStatusDescriptionKeysCount);
    });
  });


  it('should have have all letters of the alphabet as keys', () => {
    return statusDescriptionService.generateStatusDescriptionObject().then((data) => {
      expect(Object.keys(data)).to.deep.equal(alphabet);
    });
  });

  it(`should have ${validStatusDescription} key`, () => {
    return statusDescriptionService.generateStatusDescriptionObject().then((data) => {
      expect(validStatusDescription).to.deep.equal(data['A'][1].status);
    });

  });

  it('should not have invalid status', () => {
    return statusDescriptionService.generateStatusDescriptionObject().then((data) => {
      expect(invalidStatusDescription in data['A']).to.be.false;
    });
  });
});
