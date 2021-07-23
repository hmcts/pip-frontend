import { Application } from 'express';
import * as fs from 'fs';
import path from 'path';

export default function(app: Application): void {
  const mocksPath = '../../resources/mocks/';

  app.get('/api/court/:courtId', (req, res) => {
    const courtId = parseInt(req.params['courtId']);
    const rawData = fs.readFileSync(path.resolve(__dirname, mocksPath, 'courtsAndHearingsCount.json'), 'utf-8');
    const courtsData = JSON.parse(rawData);
    const court = courtsData?.results.filter((court) => court.courtId === courtId);
    console.log(court);
  });

  app.get('/api/courts/list', (req, res) => {
    const rawData = fs.readFileSync(path.resolve(__dirname, mocksPath, 'courtsAndHearingsCount.json'), 'utf-8');
    const courtsData = JSON.parse(rawData);
    courtsData?.results ? console.log(courtsData) : console.error('unable to get courts data');
  });

  app.get('/api/hearings/:courtId', (req, res) => {
    try {
      const courtId = parseInt(req.params['courtId']);
      const rawData = fs.readFileSync(path.resolve(__dirname, mocksPath, 'hearingsList.json'), 'utf-8');
      const hearingsData = JSON.parse(rawData);
      const courtHearings = hearingsData?.results.filter((hearing) => hearing.courtId === courtId);
      console.log(courtHearings);
    }
    catch (error) {
      console.error('Unable to fetch court hearings', error);
      res.render('error');
    }
  });

  app.get('/api/hearing/:hearingId', (req, res) => {
    try {
      const hearingId = parseInt(req.params['hearingId']);
      const rawData = fs.readFileSync(path.resolve(__dirname, mocksPath, 'hearingsList.json'), 'utf-8');
      const hearingsData = JSON.parse(rawData);
      const hearingDetails = hearingsData?.results.find((hearing) => hearing.hearingId === hearingId);
      console.log(hearingDetails);
    }catch (error) {
      console.error('Unable to fetch hearing details', error);
      res.render('error');
    }
  });

}



