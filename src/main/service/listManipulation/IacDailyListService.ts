import { ListParseHelperService } from '../listParseHelperService';
import { formatDate } from '../../helpers/dateTimeHelper';

export class IacDailyListService {
    helperService = new ListParseHelperService();
    public manipulateIacDailyListData(iacDailyList: string, language: string): object {
        const iacDailyListData = JSON.parse(iacDailyList);

        iacDailyListData['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    session['formattedJudiciary'] = this.getDeduplicatedJudiciaryNameSurname(session);
                    session['sittings'].forEach(sitting => {
                        sitting['sittingStartFormatted'] = formatDate(sitting['sittingStart'], 'h:mma', language);
                        this.helperService.findAndConcatenateHearingPlatform(sitting, session);
                        sitting['hearing'].forEach(hearing => {
                            this.helperService.findAndManipulatePartyInformation(hearing);
                            this.helperService.findAndManipulateLinkedCases(hearing);
                        });
                    });
                });
            });
        });
        return iacDailyListData;
    }

    private getDeduplicatedJudiciaryNameSurname(session: object): string {
        const judiciaries = [];
        session['judiciary']?.forEach(judiciary => {
            let currentJudiciary = '';
            if (ListParseHelperService.writeStringIfValid(judiciary?.johTitle) !== '') {
                currentJudiciary = ListParseHelperService.writeStringIfValid(judiciary?.johTitle);
            }

            if (ListParseHelperService.writeStringIfValid(judiciary?.johNameSurname) !== '') {
                if (ListParseHelperService.writeStringIfValid(judiciary?.johTitle) !== '') {
                    currentJudiciary += ' ';
                }
                currentJudiciary += ListParseHelperService.writeStringIfValid(judiciary?.johNameSurname);
            }

            if (!judiciaries.includes(currentJudiciary)) {
                judiciaries.push(currentJudiciary);
            }
        });
        return judiciaries.join(', ');
    }
}
