import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import {InputFilterService} from '../service/inputFilterService';

const searchAgainst = ['name', 'jurisdiction', 'location'];
const inputService = new InputFilterService();

export default class LocalApiController {

  public apiAllCourtList(req: Request, res: Response): any {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../resources/mocks/courtsAllReduced.json'), 'utf-8');
    const model = JSON.parse(rawData);
    return res.send(Object.values(model));
  }

  public apiCourtList(req: Request, res: Response): any {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../resources/mocks/courtAndHearings2.json'), 'utf-8');
    const model = JSON.parse(rawData);
    const input = req.params.input;
    return res.send(Object.values(inputService.findCourts(input, searchAgainst, model)));
  }

  public apiHearingsList(req: Request, res: Response): any {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../resources/mocks/courtAndHearings2.json'), 'utf-8');
    const model = JSON.parse(rawData);
    const courtId = req.params.courtId;
    const court = model.filter(c=>c.courtId == courtId)[0];
    return res.send(court);
  }

  public apiFindHearings(req: Request, res: Response): any {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../resources/mocks/hearingsList.json'), 'utf-8');
    const model = JSON.parse(rawData);
    const searchQuery = req.params.input;
    const results = [];
    model.forEach((c) => {
      if (c.caseNumber.toLowerCase().includes(searchQuery) || c.caseName.toLowerCase().includes(searchQuery)) {
        results.push(c);
      }
    });
    return res.send(results);
  }
}
