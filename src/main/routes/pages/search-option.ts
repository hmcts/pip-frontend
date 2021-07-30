import { Application } from 'express';

export default function(app: Application): void {

  app.post('/search-option', (req, res) => {
    if (req.body['find-choice'] === 'search') {
      res.redirect('/search');
    }

  });
  app.get('/search-option', (req, res) => {
    res.render('search-option');
  });

}
