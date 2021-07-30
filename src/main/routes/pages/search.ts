import { Application } from 'express';

export default function(app: Application): void {

  app.get('/search', (req, res) => {
    res.render('search');
  });

}
