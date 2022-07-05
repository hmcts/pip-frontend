import { LocationService } from '../../../main/service/locationService';
import sinon from 'sinon';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import {LocationRequests} from '../../../main/resources/requests/locationRequests';

const courtService = new LocationService();

const courtRequest = LocationRequests.prototype;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const hearingsData = JSON.parse(rawData);

sinon.stub(courtRequest, 'getAllLocations').returns(hearingsData);
const stubCourt = sinon.stub(courtRequest, 'getLocation');
const stubCourtByName = sinon.stub(courtRequest, 'getLocationByName');
const stubCourtsFilter = sinon.stub(courtRequest, 'getFilteredCourts');

const validKeysCount = 26;
const alphabet = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];
const validCourt = 'Abergavenny Magistrates\' Court';
const language = 'eng';

stubCourtsFilter.withArgs('', 'Crown').returns(hearingsData);
stubCourt.withArgs(1).returns(hearingsData[0]);
stubCourtByName.withArgs(validCourt).returns(hearingsData[0]);

describe('Court Service', () => {
  it('should return all courts', async () => {
    expect(await courtService.fetchAllLocations(language)).to.equal(hearingsData);
  });

  it('should return welsh courts name', async () => {
    const data = await courtService.fetchAllLocations('cy');
    expect(data[0].name).to.equal(hearingsData[0]['welshName']);
  });

  it('should return welsh courts region', async () => {
    const data = await courtService.fetchAllLocations('cy');
    expect(data[0].region).to.equal(hearingsData[0]['welshRegion']);
  });

  it('should return welsh courts jurisdiction', async () => {
    const data = await courtService.fetchAllLocations('cy');
    expect(data[0].jurisdiction).to.equal(hearingsData[0]['welshJurisdiction']);
  });

  it('should return found court for id', async () => {
    expect(await courtService.getLocationById(1)).to.equal(hearingsData[0]);
  });

  it('should return empty court for invalid id', async () => {
    stubCourt.withArgs(100).returns(null);
    expect(await courtService.getLocationById(100)).to.equal(null);
  });

  it('should return found court for court name match', async () => {
    expect(await courtService.getLocationByName(validCourt)).to.equal(hearingsData[0]);
  });

  it('should return null for no name match', async () => {
    stubCourtByName.withArgs('test').returns(null);
    expect(await courtService.getLocationByName('test')).to.equal(null);
  });

  it(`should return object with ${validKeysCount} keys`, async () => {
    const data = await courtService.generateAlphabetisedAllCourtList(language);
    expect(Object.keys(data).length).to.equal(validKeysCount);
  });

  it('should have have all letters of the alphabet as keys', async () => {
    const data = await courtService.generateAlphabetisedAllCourtList(language);
    expect(Object.keys(data)).to.deep.equal(alphabet);
  });

  it('should have keys with courts alphabetically assigned to them', async () => {
    const data = await courtService.generateAlphabetisedAllCourtList(language);
    expect(validCourt in data['A']).to.be.true;
  });

  it(`should have ${validCourt} key`, async () => {
    const data = await courtService.generateAlphabetisedCrownCourtList();
    expect(validCourt in data['A']).to.be.true;
  });

  it(`should return object with ${validKeysCount} keys Crown court`, async () => {
    const data = await courtService.generateAlphabetisedCrownCourtList();
    expect(Object.keys(data).length).to.equal(validKeysCount);
  });

  it(`should have filtered a ${validCourt} key`, async () => {
    const data = await courtService.generateFilteredAlphabetisedCourtList('', 'Crown');
    expect(validCourt in data['A']).to.be.true;
  });

  it(`should return object with ${validKeysCount} keys filtered`, async () => {
    const data = await courtService.generateFilteredAlphabetisedCourtList('', 'Crown');
    expect(Object.keys(data).length).to.equal(validKeysCount);
  });

  it('should return sorted courts list', () => {
    const sorted = courtService.sortCourtsAlphabetically(hearingsData);
    expect(sorted[0].name).to.equal('Abergavenny Magistrates\' Court');
    expect(sorted[1].name).to.equal('Accrington County Court');
    expect(sorted[2].name).to.equal('Accrington Magistrates\' Court');
    expect(sorted[sorted.length - 1].name).to.equal('West London Court no hearings');
  });

  it('it should return empty list if there are no courts to sort', () => {
    expect(courtService.sortCourtsAlphabetically([])).to.deep.equal([]);
  });

  it('it should return list as it is if there is only 1 court in the list', () => {
    expect(courtService.sortCourtsAlphabetically([hearingsData[0]])).to.deep.equal([hearingsData[0]]);
  });
});
