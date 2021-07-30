import { Application } from 'express';
import { HearingActions } from '../../resources/actions/hearingActions';

export default function(app: Application): void {

  var courtList = new HearingActions().getCourtHearings(2);
  console.log(courtList);
  app.get('/list', (req, res) => {
    res.render('list', {courtName: 'Test Court', hearings: courtList});
  });

}
