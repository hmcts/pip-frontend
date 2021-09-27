import { CourtService } from '../../../main/service/courtService';
import sinon from 'sinon';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import {PipApi} from '../../../main/utils/PipApi';
const axios = require('axios');
jest.mock('axios');


const api = new PipApi(axios);
const stub = sinon.stub(api, 'getAllCourtList');
const rawData = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/courtsAndHearingsCount.json'), 'utf-8');
const hearingsData = JSON.parse(rawData);
stub.withArgs().returns(hearingsData);
const courtService = new CourtService(api);
const validKeysCount = 26;
const alphabet = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];
const validCourt = 'Abergavenny Magistrates\' Court';
const invalidCourt = 'Birmingham Magistrate\'s Court';

describe('Court Service', () => {
  it(`should return object with ${validKeysCount} keys`, () => {
    return courtService.generateCrownCourtArray().then((data) => {
      expect(Object.keys(data).length).to.equal(validKeysCount);
    });
  });

  it('should have have all letters of the alphabet as keys', () => {
    return courtService.generateCrownCourtArray().then((data) => {
      expect(Object.keys(data)).to.deep.equal(alphabet);
    });
  });

  it(`should have ${validCourt} key`, () => {
    return courtService.generateCrownCourtArray().then((data) => {
      expect(validCourt in data['A']).to.be.true;
    });
  });

  it('should not have magistrate court', () => {
    return courtService.generateCrownCourtArray().then((data) => {
      expect(invalidCourt in data['B']).to.be.false;
    });
  });
});
