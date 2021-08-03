import {Application} from "express";

export default class CourtListController {

  public get(req: Request, res: Application) {

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
    for (let i = 0; i < 26; i++) {
      let letter = String.fromCharCode(65 + i)
      alphabetArray[letter] = {};
    }

    console.log(alphabetArray)
    res.render("court-list", {
      courtList: alphabetArray
    });
  }

}
