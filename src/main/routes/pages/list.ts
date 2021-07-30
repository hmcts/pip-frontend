import { Application } from 'express';
import { HearingActions } from '../../resources/actions/hearingActions';
import moment from 'moment';

export default function(app: Application): void {

  app.get('/list', (req, res) => {

    var courtId = req.query.courtId as string;

    //If no court ID has been supplied, then return the error page
    if (courtId != undefined) {
      var courtList = new HearingActions().getCourtHearings(parseInt(courtId as string));

      //Returns the error page if the court list is empty
      console.log(courtList)
      if (courtList.size == 0) {
        res.render('error')
      }

      res.render('list', {
        courtName: 'Test Court',
        hearings: courtList,
        date: moment().format('MMMM DD YYYY')
      });
    } else {
      res.render('error');
    }
  });

}
