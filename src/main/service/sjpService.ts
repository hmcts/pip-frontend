import { SingleJusticeProcedureCase } from '../models/singleJusticeProcedureCase';
import { SjpRequests } from '../resources/requests/sjpRequests';

const SJPRequests = new SjpRequests();

export class SjpService {
    public async getSJPCases(): Promise<SingleJusticeProcedureCase[]> {
        return SJPRequests.getSJPCases();
    }
}
