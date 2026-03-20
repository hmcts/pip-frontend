import { expect } from 'chai';
import { CopDailyListService } from '../../../../main/service/listManipulation/CopDailyListService';
import fs from 'fs';
import path from 'path';

const service = new CopDailyListService();
const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/copDailyCauseList.json'), 'utf-8');

describe('COP Daily Cause List service.', function () {
    it('should manipulate copDailyCauseList and format judiciary', function () {
        const result = service.manipulateCopDailyCauseList(rawData);

        result['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    expect(session).to.have.property('formattedJudiciary');
                    expect(session).to.not.have.property('judiciary');
                });
            });
        });
    });

    it('should calculate duration and concatenate hearing platform for each sitting', function () {
        const result = service.manipulateCopDailyCauseList(rawData);
        result['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    session['sittings'].forEach(sitting => {
                        expect(sitting).to.have.property('duration');
                        expect(sitting).to.have.property('caseHearingChannel');
                    });
                });
            });
        });
    });
});
