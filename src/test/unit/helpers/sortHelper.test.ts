import {
    caseSubscriptionSorter,
    locationSubscriptionSorter, pendingCaseSubscriptionSorter,
    pendingLocationSubscriptionSorter
} from "../../../main/helpers/sortHelper";

describe('Sort Helper', () => {
    describe('Location subscription sorter', () => {
        it('should sort by location names', () => {
            const locations = [
                { locationName: 'Test Court' },
                { locationName: 'Court A' },
                { locationName: 'Court C' },
                { locationName: 'Court B' },
            ];

            expect(locations.sort(locationSubscriptionSorter)).toStrictEqual([
                { locationName: 'Court A' },
                { locationName: 'Court B' },
                { locationName: 'Court C' },
                { locationName: 'Test Court' },
            ]);
        });
    });

    describe('Pending location subscription sorter', () => {
        it('should sort by location names', () => {
            const locations = [
                { name: 'Test Court' },
                { name: 'Court A' },
                { name: 'Court C' },
                { name: 'Court B' },
            ];

            expect(locations.sort(pendingLocationSubscriptionSorter)).toStrictEqual([
                { name: 'Court A' },
                { name: 'Court B' },
                { name: 'Court C' },
                { name: 'Test Court' },
            ]);
        });
    });

    describe('Case subscription sorter', () => {
        it('should sort by case names', () => {
            const cases = [
                { caseName: 'case A' },
                { caseName: 'Case A' },
                { caseName: 'New Case' },
                { caseName: 'My Case' },
            ];

            expect(cases.sort(caseSubscriptionSorter)).toStrictEqual([
                { caseName: 'Case A' },
                { caseName: 'My Case' },
                { caseName: 'New Case' },
                { caseName: 'case A' },
            ]);
        });

        it('should sort case subscriptions with empty case name comes last', () => {
            const cases = [
                { caseName: '' },
                { caseName: 'Case A' },
                { caseName: null },
                { caseName: 'Case B' },
            ];
            expect(cases.sort(caseSubscriptionSorter)).toStrictEqual([
                { caseName: 'Case A' },
                { caseName: 'Case B' },
                { caseName: '' },
                { caseName: null },
            ]);
        });

        it('should sort by case numbers if same case name', () => {
            const cases = [
                { searchType: 'CASE_ID', caseName: 'Case A', caseNumber: '125' },
                { searchType: 'CASE_ID', caseName: 'Case A', caseNumber: '234' },
                { searchType: 'CASE_ID', caseName: 'Case A', caseNumber: '123' },
                { searchType: 'CASE_ID', caseName: 'Case A', caseNumber: '124' },
            ];

            expect(cases.sort(caseSubscriptionSorter)).toStrictEqual([
                { searchType: 'CASE_ID', caseName: 'Case A', caseNumber: '123' },
                { searchType: 'CASE_ID', caseName: 'Case A', caseNumber: '124' },
                { searchType: 'CASE_ID', caseName: 'Case A', caseNumber: '125' },
                { searchType: 'CASE_ID', caseName: 'Case A', caseNumber: '234' },
            ]);
        });

        it('should sort by case URNs if same case name', () => {
            const cases = [
                { searchType: 'CASE_URN', caseName: 'Case A', urn: '125' },
                { searchType: 'CASE_URN', caseName: 'Case A', urn: '234' },
                { searchType: 'CASE_URN', caseName: 'Case A', urn: '123' },
                { searchType: 'CASE_URN', caseName: 'Case A', urn: '124' },
            ];

            expect(cases.sort(caseSubscriptionSorter)).toStrictEqual([
                { searchType: 'CASE_URN', caseName: 'Case A', urn: '123' },
                { searchType: 'CASE_URN', caseName: 'Case A', urn: '124' },
                { searchType: 'CASE_URN', caseName: 'Case A', urn: '125' },
                { searchType: 'CASE_URN', caseName: 'Case A', urn: '234' },
            ]);
        });

        it('should sort by case names first followed by case numbers', () => {
            const cases = [
                { searchType: 'CASE_ID', caseName: 'Case A', caseNumber: '124' },
                { searchType: 'CASE_ID', caseName: 'Case B', caseNumber: '123' },
                { searchType: 'CASE_ID', caseName: 'Case B', caseNumber: '124' },
                { searchType: 'CASE_ID', caseName: 'Case A', caseNumber: '123' },
            ];

            expect(cases.sort(caseSubscriptionSorter)).toStrictEqual([
                { searchType: 'CASE_ID', caseName: 'Case A', caseNumber: '123' },
                { searchType: 'CASE_ID', caseName: 'Case A', caseNumber: '124' },
                { searchType: 'CASE_ID', caseName: 'Case B', caseNumber: '123' },
                { searchType: 'CASE_ID', caseName: 'Case B', caseNumber: '124' },
            ]);
        });
    });

    describe('Pending case subscription sorter', () => {
        it('should sort by case names', () => {
            const cases = [
                { caseName: 'case A' },
                { caseName: 'Case A' },
                { caseName: 'New Case' },
                { caseName: 'My Case' },
            ];

            expect(cases.sort(pendingCaseSubscriptionSorter)).toStrictEqual([
                { caseName: 'Case A' },
                { caseName: 'My Case' },
                { caseName: 'New Case' },
                { caseName: 'case A' },
            ]);
        });

        it('should sort case subscriptions with empty case name comes last', () => {
            const cases = [
                { caseName: '' },
                { caseName: 'Case A' },
                { caseName: null },
                { caseName: 'Case B' },
            ];
            expect(cases.sort(pendingCaseSubscriptionSorter)).toStrictEqual([
                { caseName: 'Case A' },
                { caseName: 'Case B' },
                { caseName: '' },
                { caseName: null },
            ]);
        });

        it('should sort by case numbers if same case name', () => {
            const cases = [
                { caseName: 'Case A', caseNumber: '125' },
                { caseName: 'Case A', caseNumber: '234' },
                { caseName: 'Case A', caseNumber: '123' },
                { caseName: 'Case A', caseNumber: '124' },
            ];

            expect(cases.sort(pendingCaseSubscriptionSorter)).toStrictEqual([
                { caseName: 'Case A', caseNumber: '123' },
                { caseName: 'Case A', caseNumber: '124' },
                { caseName: 'Case A', caseNumber: '125' },
                { caseName: 'Case A', caseNumber: '234' },
            ]);
        });

        it('should sort by case URNs if same case name', () => {
            const cases = [
                { caseName: 'Case A', caseUrn: '125' },
                { caseName: 'Case A', caseUrn: '234' },
                { caseName: 'Case A', caseUrn: '123' },
                { caseName: 'Case A', caseUrn: '124' },
            ];

            expect(cases.sort(pendingCaseSubscriptionSorter)).toStrictEqual([
                { caseName: 'Case A', caseUrn: '123' },
                { caseName: 'Case A', caseUrn: '124' },
                { caseName: 'Case A', caseUrn: '125' },
                { caseName: 'Case A', caseUrn: '234' },
            ]);
        });

        it('should sort by case names first followed by non-empty case references', () => {
            const cases = [
                { caseName: 'Case A', caseNumber: '124', caseUrn: '' },
                { caseName: 'Case B', caseNumber: '123', caseUrn: '' },
                { caseName: 'Case A', caseNumber: '', caseUrn: '125' },
                { caseName: 'Case A', caseNumber: '', caseUrn: '123' },
            ];

            expect(cases.sort(pendingCaseSubscriptionSorter)).toStrictEqual([
                { caseName: 'Case A', caseNumber: '', caseUrn: '123' },
                { caseName: 'Case A', caseNumber: '124', caseUrn: '' },
                { caseName: 'Case A', caseNumber: '', caseUrn: '125' },
                { caseName: 'Case B', caseNumber: '123', caseUrn: '' },
            ]);
        });
    });
});
