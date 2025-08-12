import { ListParseHelperService } from '../ListParseHelperService';

const helperService = new ListParseHelperService();

export class MagistratesAdultCourtListService {
    public processPayload(payload: JSON, language: string): any[] {
        const results = [];
        payload['document'].data.job.sessions.forEach(sessionsNode => {
            const sessionNode = sessionsNode.session;
            const cases = this.buildCases(sessionNode, language);
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

    private buildCases(sessionNode: any, language: string): any[] {
        const cases = [];
        sessionNode.blocks.forEach(blocksNode => {
            blocksNode.block.cases.forEach(casesNode => {
                const caseNode = casesNode.case;
                const caseInfo = {
                    blockStartTime: helperService.publicationTimeInUkTime(blocksNode.block.bstart),
                    caseNumber: caseNode.caseno,
                    defendantName: caseNode.def_name,
                    defendantDob: caseNode.def_dob ? caseNode.def_dob : '',
                    defendantAge: caseNode.def_age ? caseNode.def_age : '',
                    defendantAddress: this.formatDefendantAddress(caseNode.def_addr),
                    informant: caseNode.inf,
                    offence: this.processOffences(caseNode.offences, language)
                }
                cases.push(caseInfo);
            });
        });
        return cases;
    }

    private formatDefendantAddress(addressNode: any): string {
        const formattedAddress = [];

        formattedAddress.push(addressNode.line1 ? addressNode.line1 : '');
        formattedAddress.push(addressNode.line2 ? addressNode.line2 : '');
        formattedAddress.push(addressNode.line3 ? addressNode.line3 : '');
        formattedAddress.push(addressNode.line4 ? addressNode.line4 : '');
        formattedAddress.push(addressNode.line5 ? addressNode.line5 : '');
        formattedAddress.push(addressNode.pcode ? addressNode.pcode : '');

        return formattedAddress.filter(line => line.trim().length > 0).join(', ');
    }

    private processOffences(offencesNode: any, language: string): any {
        const offenceCodes = [];
        const offenceTitles = [];
        const offenceSummaries = [];

        offencesNode.forEach(offencesNode => {
            if (offencesNode?.offence) {
                const offenceNode = offencesNode.offence;
                offenceCodes.push(offenceNode.code);
                offenceTitles.push(language === 'cy' && offenceNode.cy_title ? offenceNode.cy_title : offenceNode.title);
                offenceSummaries.push(language === 'cy' && offenceNode.cy_sum ? offenceNode.cy_sum :offenceNode.sum);
            }
        });
        return {
            offenceCode: offenceCodes.filter(line => line.trim().length > 0).join(', '),
            offenceTitle: offenceTitles.filter(line => line.trim().length > 0).join(', '),
            offenceSummary: offenceSummaries.filter(line => line.trim().length > 0).join(', ')
        }
    }
}
