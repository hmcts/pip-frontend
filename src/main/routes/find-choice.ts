import { Application } from 'express';

export default function(app: Application): void {

  app.get('/find-choice', (req, res) => {
    res.render('find-choice');
  });

}
