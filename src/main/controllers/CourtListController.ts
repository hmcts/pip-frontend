import {Application} from "express";
import {CourtActions} from '../resources/actions/CourtActions';
import {randomBytes} from 'crypto'

export default class CourtListController {

  public get(req: Request, res: Application) {

    let courtsList = new CourtActions().getCourtsList();
    /*Should produce something like:
    {
      "A": {
        "Court A": "1",
        "Court B": "2",
      },
      "B": {}
    }
    */
    let alphabetArray = {};

    //Firstly creates the array for the possible alphabet options
    for (let i = 0; i < 26; i++) {
      let letter = String.fromCharCode(65 + i)
      alphabetArray[letter] = {};
    }

    //Then loop through each court, and add it to the list
    courtsList.forEach(item => {
      let courtName = item.name as string;
      alphabetArray[courtName.charAt(0).toUpperCase()][courtName] = item.hearings;
    })

    const bytes = randomBytes(16).toString('base64')

    res.set("Content-Security-Policy", 'script-src \'nonce-' + bytes + '\'');
    res.render("court-list", {
      courtList: alphabetArray,
      scriptNonce: bytes
    });
  }

}
