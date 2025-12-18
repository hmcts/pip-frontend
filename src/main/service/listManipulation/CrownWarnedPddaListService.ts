import { CrownPddaListService } from './CrownPddaListService';
import { DateTime } from 'luxon';

const crownPddaListService = new CrownPddaListService();

export class CrownWarnedPddaListService {
    public processPayload(warnedPddaListData: JSON): Map<string, object[]> {
        const groupedData = new Map<string, object[]>();

        warnedPddaListData['WarnedList'].CourtLists.forEach((courtList: any) => {
            courtList.WithFixedDate?.forEach((withFixDate: any) => {
                this.formatFixture(withFixDate, groupedData, false);
            });
            courtList.WithoutFixedDate?.forEach((withoutFixDate: any) => {
                this.formatFixture(withoutFixDate, groupedData, true);
            });
        });

        // Sort cases by fixed date within each group
        groupedData.forEach(cases => {
            cases.sort((a: any, b: any) => new Date(a.fixedDate).getTime() - new Date(b.fixedDate).getTime());
        });

        return groupedData;
    }

    private formatFixture(fixtureDate: any, groupedData: Map<string, object[]>, isWithoutFixeDate: boolean): any {
        const fixedDate = fixtureDate.Fixture.FixedDate;
        fixtureDate.Fixture.Cases.forEach((hearingCase: any) => {
            hearingCase.Hearing.forEach((hearing: any) => {
                const hearingDescription = !isWithoutFixeDate ? hearing.HearingDescription : 'To be allocated';
                if (!groupedData.has(hearingDescription)) {
                    groupedData.set(hearingDescription, []);
                }

                groupedData.get(hearingDescription)!.push(this.formatCaseInformation(fixedDate, hearing, hearingCase));
            });
        });
    }

    private formatCaseInformation(fixedDate: any, hearing: any, hearingCase: any): any {
        const caseReference = hearingCase.CaseNumberCaTH;
        const defendantNames = hearingCase.Defendants
            ? crownPddaListService.formatDefendantName(hearingCase.Defendants)
            : '';
        const prosecutingAuthority = hearingCase.Prosecution?.ProsecutingAuthority
            ? hearingCase.Prosecution.ProsecutingAuthority
            : '';
        const linkedCases = hearingCase.LinkedCases?.map((linkedCase: any) => linkedCase.CaseNumber).join(', ') || '';
        const listingNotes = hearing.ListNote || '';

        return {
            fixedDate: fixedDate ? new Date(fixedDate).toLocaleDateString('en-GB') : '',
            caseReference: caseReference,
            defendantNames: defendantNames,
            prosecutingAuthority: prosecutingAuthority,
            linkedCases: linkedCases,
            listingNotes: listingNotes,
        };
    }

    public formatContentDate(contentDate: string, language: string) {
        const date = new Date(contentDate);
        // Move the date to the past Monday if it is not on a Monday
        date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        return DateTime.fromISO(date.toISOString(), { zone: 'utc' }).setLocale(language).toFormat('dd MMMM yyyy');
    }
}
