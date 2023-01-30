import fs from "fs";
import path from "path";
import { SingleJusticeProcedureCase } from "../../models/singleJusticeProcedureCase";

export class SjpRequests {
  mocksPath = "../mocks";
  rawData = fs.readFileSync(
    path.resolve(__dirname, this.mocksPath, "SingleJusticeProcedureCases.json"),
    "utf-8"
  );

  getSJPCases(): SingleJusticeProcedureCase[] {
    return JSON.parse(this.rawData).results;
  }
}
