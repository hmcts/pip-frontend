import { Application } from 'express';

export default function(app: Application): void {

  app.get('/list', (req, res) => {
    res.render('list');
  });

}
