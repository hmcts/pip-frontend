import { DailyCauseListRequests } from '../resources/requests/dailyCauseListRequests';
import moment from 'moment';

const dailyCauseListRequests = new DailyCauseListRequests();

export class DailyCauseListService {
  public async getDailyCauseList(artefactId: string): Promise<any> {
    return await dailyCauseListRequests.getDailyCauseList(artefactId);
  }

  public async getDailyCauseListMetaData(artefactId: string): Promise<any> {
    return await dailyCauseListRequests.getDailyCauseListMetaData(artefactId);
  }

  public calculateHearingSessionTime(searchResults: string): void {
    let hearingCount = 0;
    searchResults['courtLists'].forEach(courtList => {
      courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
        courtRoom['session'].forEach(session => {
          session['sittings'].forEach(sitting => {
            sitting['duration'] = '';
            sitting['startTime'] = '';
            if(sitting['sittingStart'] !== '' && sitting['sittingEnd'] !== '') {
              const sittingStart = moment(sitting['sittingStart']);
              const sittingEnd = moment(sitting['sittingEnd']);

              const duration = moment.duration(sittingEnd.startOf('hour').diff(sittingStart.startOf('hour')));
              sitting['duration'] = duration.asHours();
              sitting['startTime'] = sittingStart.format('hha');
            }
            hearingCount = hearingCount + sitting['hearing'].length;
          });
        });
        courtRoom['totalHearing'] = hearingCount;
        hearingCount = 0;
      });
    });
  }
}
