import { ListParseHelperService } from '../ListParseHelperService';

const helperService = new ListParseHelperService();

export class MagistratesPublicAdultCourtListDailyService {
    public processPayload(payload: JSON): any[] {
        const results = [];
        payload['document'].data.job.sessions.forEach(sessionNode => {
            const cases = this.buildCases(sessionNode);
            results.push({
                lja: sessionNode.lja,
                courtName: sessionNode.court,
                courtRoom: sessionNode.room,
                sessionStartTime: helperService.publicationTimeInUkTime(sessionNode.sstart),
                cases,
            });
        });
        return results;
    }

    private buildCases(sessionNode: any): any[] {
        const cases = [];
        sessionNode.blocks.forEach(blockNode => {
            blockNode.cases.forEach(caseNode => {
                const caseInfo = {
                    caseNumber: caseNode.caseno,
                    blockStartTime: helperService.publicationTimeInUkTime(blockNode.bstart),
                    defendantName: caseNode.def_name
                }
                cases.push(caseInfo);
            });
        });
        return cases;
    }
}
