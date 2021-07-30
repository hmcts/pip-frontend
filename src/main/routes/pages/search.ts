import { Application } from 'express';

export default function (app: Application): void {

  app.get('/search', (req, res) => {
    res.render('search');
  });

  app.post('/search', (req, res) => {
    const searchInput = req.body['search-input'];
    // TODO: PUB-508
    console.log(searchInput);
  });

}
