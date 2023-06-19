import { expect } from 'chai';
import * as nunjucks from 'nunjucks';

const env = new nunjucks.Environment();
const addFilters = require('../../../../main/modules/nunjucks/njkFilters');
addFilters(env);
describe('Nunjucks Custom Filter Tests', function () {
    describe('getDuration Filter', function () {
        it('should render duration correctly', function () {
            const durationString = env.renderString('{{ 3|getDuration(30, lng) }}', {
                lng: 'en',
            });
            expect(durationString).to.equal('3 hours 30 mins');
        });
        it('should render duration correctly in welsh', function () {
            const durationString = env.renderString('{{ 3|getDuration(30, lng) }}', {
                lng: 'cy',
            });
            expect(durationString).to.equal('3 awr 30 munud');
        });
        it('should render duration correctly even with zero hours', function () {
            const durationString = env.renderString('{{ 0|getDuration(30, lng) }}', {
                lng: 'en',
            });
            expect(durationString).to.equal('30 mins');
        });
        it('should render duration correctly even with zero mins', function () {
            const durationString = env.renderString('{{ 13|getDuration(0, lng) }}', {
                lng: 'en',
            });
            expect(durationString).to.equal('13 hours');
        });
    });

    describe('Language Filter', function () {
        it('should return the pretty version of language - english', function () {
            const languageString = env.renderString('{{ "ENGLISH"|language }}', {});
            expect(languageString).to.equal('English (Saesneg)');
        });
        it('should return the pretty version of language - bilingual', function () {
            const languageString = env.renderString('{{ "BI_LINGUAL"|language }}', {});
            expect(languageString).to.equal('Bilingual (Ddwyieithog)');
        });
        it('should return the pretty version of language - welsh', function () {
            const languageString = env.renderString('{{ "WELSH"|language }}', {});
            expect(languageString).to.equal('Welsh (Cymraeg)');
        });
    });

    describe('tel link Filter', function () {
        it('should return a tel link for a given phone number', function () {
            const telString = env.renderString('{{ "0773243290"| phoneLink }}', {});
            expect(telString).to.equal('<a class=govuk-link href="tel:0773243290">0773243290</a>');
        });
    });

    describe('email link Filter', function () {
        it('should return an email link for a given phone number', function () {
            const emailString = env.renderString('{{ "jimothy@sexit.llc"| emailLink }}', {});
            expect(emailString).to.equal('<a class=govuk-link href="mailto:jimothy@sexit.llc">jimothy@sexit.llc</a>');
        });
    });

    describe('date to sort value filter', function () {
        it('should return sort value', function () {
            const result = env.renderString('{{ "07/01/2022"| dateToSortValue }}', {});
            expect(result).to.equal('20220107');
        });
    });

    describe('date with short month name to sort value filter', function () {
        it('should return sort value', function () {
            const result = env.renderString('{{ "20 Nov 2021"| dateWithShortMonthNameToSortValue }}', {});
            expect(result).to.equal('20211120');
        });

        it('should return sort value with zero padding', function () {
            const result = env.renderString('{{ "3 Jan 2021"| dateWithShortMonthNameToSortValue }}', {});
            expect(result).to.equal('20210103');
        });
    });

    describe('day month name to sort value filter', function () {
        it('should return sort value', function () {
            const result = env.renderString('{{ "07 September"| dayMonthNameToSortValue }}', {});
            expect(result).to.equal('907');
        });
    });

    describe('time to sort value filter', function () {
        it('should return sort value for hours only in AM', function () {
            const result = env.renderString('{{ "8am"| timeToSortValue }}', {});
            expect(result).to.equal('800');
        });

        it('should return sort value for hours only in PM', function () {
            const result = env.renderString('{{ "9pm"| timeToSortValue }}', {});
            expect(result).to.equal('2100');
        });

        it('should return sort value for hours and minutes in AM', function () {
            const result = env.renderString('{{ "1:07am"| timeToSortValue }}', {});
            expect(result).to.equal('107');
        });

        it('should return sort value for hours and minutes in PM', function () {
            const result = env.renderString('{{ "2:30pm"| timeToSortValue }}', {});
            expect(result).to.equal('1430');
        });

        it('should return sort value for noon', function () {
            const result = env.renderString('{{ "12pm"| timeToSortValue }}', {});
            expect(result).to.equal('1200');
        });

        it('should return sort value for midnight', function () {
            const result = env.renderString('{{ "12am"| timeToSortValue }}', {});
            expect(result).to.equal('0');
        });
    });

    describe('duration to sort value filter', function () {
        it('should return sort value for hours and minutes', function () {
            const result = env.renderString('{{ 3 | durationToSortValue(20) }}', {});
            expect(result).to.equal('200');
        });

        it('should return sort value for hours only', function () {
            const result = env.renderString('{{ 2 | durationToSortValue(0) }}', {});
            expect(result).to.equal('120');
        });

        it('should return sort value for minutes only', function () {
            const result = env.renderString('{{ 0 | durationToSortValue(40) }}', {});
            expect(result).to.equal('40');
        });
    });

    describe('add representative to party', function () {
        it('should return applicant and representative', function () {
            const result = env.renderString(
                '{{ "applicantName" | addRepresentativeToParty("repName", "Legal Advisor") }}',
                {}
            );
            expect(result).to.equal('applicantName, Legal Advisor: repName');
        });

        it('should return applicant only', function () {
            const result = env.renderString(
                '{{ "applicantName" | addRepresentativeToParty("", "Legal Advisor") }}',
                {}
            );
            expect(result).to.equal('applicantName');
        });

        it('should return representative only', function () {
            const result = env.renderString('{{ "" | addRepresentativeToParty("repName", "Legal Advisor") }}', {});
            expect(result).to.equal('Legal Advisor: repName');
        });

        it('should return empty string', function () {
            const result = env.renderString('{{ "" | addRepresentativeToParty("", "Legal Advisor") }}', {});
            expect(result).to.be.empty;
        });
    });

    describe('mask legacy data source name', function () {
        it('should return updated data source name', function () {
            const result = env.renderString('{{ "SNL"| maskLegacyDataSource }}', {});
            expect(result).to.equal('ListAssist');
        });

        it('should return existing data source name', function () {
            const result = env.renderString('{{ "MANUAL_UPLOAD"| maskLegacyDataSource }}', {});
            expect(result).to.equal('MANUAL_UPLOAD');
        });
    });

    describe('append case sequence indicator', function () {
        it('should return data with case sequence indicator', function () {
            const result = env.renderString('{{ "1234"| appendCaseSequenceIndicator("1 of 2") }}', {});
            expect(result).to.equal('1234 [1 of 2]');
        });

        it('should return data only if case sequence indicator is null', function () {
            const result = env.renderString('{{ "1234"| appendCaseSequenceIndicator(null) }}', {});
            expect(result).to.equal('1234');
        });

        it('should return data only if case sequence indicator is empty', function () {
            const result = env.renderString('{{ "1234"| appendCaseSequenceIndicator("") }}', {});
            expect(result).to.equal('1234');
        });

        it('should return data only if case sequence indicator is undefined', function () {
            const result = env.renderString('{{ "1234"| appendCaseSequenceIndicator(undefined) }}', {});
            expect(result).to.equal('1234');
        });

        it('should return case sequence indicator only if data is null', function () {
            const result = env.renderString('{{ null | appendCaseSequenceIndicator("1 of 2") }}', {});
            expect(result).to.equal('[1 of 2]');
        });

        it('should return case sequence indicator only if data is empty', function () {
            const result = env.renderString('{{ ""| appendCaseSequenceIndicator("1 of 2") }}', {});
            expect(result).to.equal('[1 of 2]');
        });
    });
});
