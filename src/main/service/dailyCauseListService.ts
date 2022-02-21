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

              //CALCULATE DURATION
              let durationAsHours = 0;
              let durationAsMinutes = moment.duration(sittingEnd.startOf('minutes').diff(sittingStart.startOf('minutes'))).asMinutes();
              if(durationAsMinutes >= 60) {
                durationAsHours = moment.duration(sittingEnd.startOf('hours').diff(sittingStart.startOf('hours'))).asHours();
                durationAsMinutes = durationAsMinutes - (durationAsHours * 60);
              }

              sitting['durationAsHours'] = durationAsHours;
              sitting['durationAsMinutes'] = durationAsMinutes;

              const min = moment(sitting['sittingStart'],'HH:mm').minutes();
              if(min === 0) {
                sitting['startTime'] = moment(sitting['sittingStart']).format('ha');
              } else {
                sitting['startTime'] = moment(sitting['sittingStart']).format('h.mma');
              }
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
