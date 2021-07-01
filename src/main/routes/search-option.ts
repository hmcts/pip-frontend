import { Application } from 'express';

export default function(app: Application): void {

  app.get('/search-option', (req, res) => {
    res.render('search-option');
  });

}
