import { CrownPddaListService } from './CrownPddaListService';

const crownPddaListService = new CrownPddaListService();

export class CrownWarnedPddaListService {
    public processPayload(warnedPddaListData: JSON): Map<string, object[]> {
        const groupedData = new Map<string, object[]>();

        warnedPddaListData['WarnedList'].CourtLists.forEach((courtList: any) => {
            courtList.WithFixedDate.forEach((withFixDate: any) => {
                this.formatFixture(withFixDate, groupedData, false);
            });
            if (courtList.WithoutFixedDate) {
                this.formatFixture(courtList.WithoutFixedDate, groupedData, true);
            }
        });

        // Sort cases by fixed date within each group
        groupedData.forEach((cases) => {
            cases.sort((a: any, b: any) =>
                new Date(a.fixedDate).getTime() - new Date(b.fixedDate).getTime()
            );
        });

        return groupedData;
    }

    private formatFixture(fixtureDate: any, groupedData: Map<string, object[]>, isWithoutFixeDate: boolean): any {
        fixtureDate.Fixture.Cases.forEach((hearingCase: any) => {
            hearingCase.Hearing.forEach((hearing: any) => {
                const hearingDescription = !isWithoutFixeDate ? hearing.HearingDescription : 'To be allocated';
                if (!groupedData.has(hearingDescription)) {
                    groupedData.set(hearingDescription, []);
                }

                groupedData.get(hearingDescription)!.push(
                    this.formatCaseInformation(hearing, hearingCase)
                );
            });
        });
    }

    private formatCaseInformation(hearing: any, hearingCase: any): any {
        const fixedDate = hearing.HearingDate;
        const caseReference = hearingCase.CaseNumberCaTH;
        const defendantNames = hearingCase.Defendants ? crownPddaListService.formatDefendantName(hearingCase.Defendants) : '';
        const prosecutingAuthority = hearingCase.Prosecution?.ProsecutingAuthority
            ? hearingCase.Prosecution.ProsecutingAuthority
            : '';
        const linkedCases = hearingCase.LinkedCases?.map((linkedCase: any) => linkedCase.CaseNumber).join(', ') || '';
        const listingNotes = hearing.ListNote || '';

        return {
            fixedDate: new Date(fixedDate).toLocaleDateString('en-GB'),
            caseReference: caseReference,
            defendantNames: defendantNames,
            prosecutingAuthority: prosecutingAuthority,
            linkedCases: linkedCases,
            listingNotes: listingNotes,
        }
    }
}
