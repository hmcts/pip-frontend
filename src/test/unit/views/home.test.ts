import { app } from '../../../main/app';
import { expect } from 'chai';
import request from 'supertest';

let htmlRes: Document;
const PAGE_URL = '/';
const footerLinks = [
    {
        text: 'Help',
        href: 'https://www.gov.uk/help',
    },
    {
        text: 'Privacy',
        href: 'https://www.gov.uk/help/privacy-notice',
    },
    {
        text: 'Cookies',
        href: '/cookie-policy',
    },
    {
        text: 'Accessibility statement',
        href: '/accessibility-statement',
    },
    {
        text: 'Contact',
        href: 'https://www.gov.uk/contact',
    },
    {
        text: 'Terms and conditions',
        href: 'https://www.gov.uk/help/terms-conditions',
    },
    {
        text: 'Welsh',
        href: 'https://www.gov.uk/cymraeg',
    },
    {
        text: 'Government Digital Service',
        href: 'https://www.gov.uk/government/organisations/government-digital-service',
    },
];
const pageHeader = 'Court and tribunal hearings';

describe('Home page', () => {
    describe('with English translations', () => {
        beforeAll(async () => {
            app.request['lng'] = 'en';
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains(pageHeader, 'Page title does not match header');
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(header[0].innerHTML).contains(pageHeader, 'Could not find correct value in header');
        });

        it('should display beta header', () => {
            const betaHeader = htmlRes.getElementsByClassName('govuk-phase-banner');
            expect(betaHeader[0].innerHTML).contains('beta', 'Could not find beta header');
            expect(betaHeader[0].innerHTML).contains(
                'https://www.smartsurvey.co.uk/s/FBSPI22/?pageurl=/',
                'link is broken in the beta heading.'
            );
        });

        it('should display continue button', () => {
            const buttons = htmlRes.getElementsByClassName('govuk-button');
            expect(buttons[0].innerHTML).contains('Continue', 'Could not find button');
        });

        it('should display a message', () => {
            const message = htmlRes.getElementsByClassName('govuk-body');
            expect(message[0].innerHTML).contains(
                'You can use this service to get information about:',
                'Could not find a message'
            );
        });

        it('should display bullets', () => {
            const bullets = htmlRes.getElementsByClassName('govuk-body')[1].getElementsByTagName('li');
            expect(bullets[0].innerHTML).contains(
                'Hearings in Civil and Family Courts in Milton Keynes, Oxford, Reading, High Wycombe and Slough',
                'Could not find first bullet'
            );
            expect(bullets[1].innerHTML).contains(
                'Single Justice Procedure cases, including TV licensing and minor traffic offences such as speeding',
                'Could not find second bullet'
            );
        });

        it('should display more courts message', () => {
            const message = htmlRes.getElementsByClassName('govuk-body');
            expect(message[2].innerHTML).contains(
                'More courts and tribunals will become available over time.',
                'Could not find courts message'
            );
        });

        it('should display legal sign in', () => {
            const signInMessage = htmlRes.getElementsByClassName('govuk-body');
            expect(signInMessage[3].innerHTML).contains(
                'Legal and media professionals can',
                'Could not find sign in message'
            );
        });

        it('should display Welsh service message', () => {
            const message = htmlRes.getElementsByClassName('govuk-body');
            expect(message[4].innerHTML).contains(
                'This service is also available in',
                'Could not find language message'
            );
        });

        it('should display message under continue button', () => {
            const message = htmlRes.getElementsByClassName('govuk-heading-m');
            expect(message[0].innerHTML).contains('Before you start', 'Could not find before you start message');
        });

        it('should display Scotland and NI message', () => {
            const message = htmlRes.getElementsByClassName('govuk-body');
            expect(message[5].innerHTML).contains(
                "If you're in Scotland or Northern Ireland",
                'Could not find Sco and NI message'
            );
        });

        it('should display contact message', () => {
            const message = htmlRes.getElementsByClassName('govuk-body');
            expect(message[6].innerHTML).contains('Contact the:', 'Could not find contact message');
        });

        it('should display bullets', () => {
            const bullets = htmlRes.getElementsByClassName('govuk-body')[7].getElementsByTagName('li');
            expect(bullets[0].innerHTML).contains(
                'for courts and some tribunals in Scotland',
                'Could not find first bullet'
            );
            expect(bullets[1].innerHTML).contains(
                'for courts and tribunals in Northern Ireland',
                'Could not find second bullet'
            );
            expect(bullets[0].getElementsByClassName('govuk-link')[0].getAttribute('href').valueOf()).contains(
                'https://www.scotcourts.gov.uk/'
            );
            expect(bullets[0].getElementsByClassName('govuk-link')[0].innerHTML).contains('Scottish Courts website');
            expect(bullets[1].getElementsByClassName('govuk-link')[0].getAttribute('href').valueOf()).contains(
                'https://www.courtsni.gov.uk/en-GB/ContactDetails/Pages/default.aspx'
            );
            expect(bullets[1].getElementsByClassName('govuk-link')[0].innerHTML).contains(
                'Northern Ireland Courts and Tribunals Service'
            );
        });

        describe('Footer Links', () => {
            it('should have proper links and names in the footer', () => {
                const link = htmlRes.getElementsByClassName('govuk-footer__link');
                for (let i = 0; i < footerLinks.length; i++) {
                    expect(link[i].innerHTML).contain(
                        footerLinks[i].text,
                        `link ${footerLinks[i].text} has incorrect name`
                    );
                    expect(link[i].getAttribute('href')).contain(
                        footerLinks[i].href,
                        `link ${footerLinks[i].text} has incorrect path`
                    );
                }
            });
        });
    });

    describe('with Welsh translations', () => {
        beforeAll(async () => {
            app.request['lng'] = 'cy';
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(header[0].innerHTML).contains(
                'Gwrandawiadau llys a thribiwnlys',
                'Could not find correct value in header'
            );
        });

        it('should display bullets', () => {
            const bullets = htmlRes.getElementsByClassName('govuk-body')[1].getElementsByTagName('li');

            expect(bullets[0].innerHTML).contains(
                'Gwrandawiadau mewn Llysoedd Sifil a Theulu yn  Milton Keynes, Oxford, Reading, High Wycombe ac Slough',
                'Could not find first bullet'
            );

            expect(bullets[1].innerHTML).contains(
                'Achosion Gweithdrefn Un Ynad, gan gynnwys trwyddedu teledu a mân droseddau traffig megis goryrru',
                'Could not find second bullet'
            );
        });

        it('should display continue button', () => {
            const buttons = htmlRes.getElementsByClassName('govuk-button');
            expect(buttons[0].innerHTML).contains('Parhau', 'Could not find button');
        });

        it('should display Welsh service message', () => {
            const message = htmlRes.getElementsByClassName('govuk-body');
            expect(message[4].innerHTML).contains(
                "Mae'r gwasanaeth hwn hefyd ar gael yn",
                'Could not find language message'
            );
        });
    });
});
describe('Cookie banner display', () => {
    const cookieBody1 = 'We use some essential cookies to make this service work.';
    const cookieBody2 =
        'We’d also like to use analytics cookies so we can understand how you use the service and make\n' +
        '      improvements.';

    beforeAll(async () => {
        app.request['lng'] = 'en';
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display cookie banner on empty cookie policy cookie', () => {
        const cookieBanner = htmlRes.getElementsByClassName('cookie-banner-message')[0];
        expect(cookieBanner.innerHTML).contains(
            'Cookies on Court and tribunal hearings',
            'Could not find cookie header'
        );
    });

    it('should display cookie body', () => {
        const cookieBanner = htmlRes.getElementsByClassName('cookie-banner-message')[0];
        expect(cookieBanner.innerHTML).contains(cookieBody1, 'Could not find cookie body');
        expect(cookieBanner.innerHTML).contains(cookieBody2, 'Could not find cookie body');
    });

    it('should display accept cookie button', () => {
        const acceptButton = htmlRes.getElementsByClassName('cookie-banner-accept-button')[0];
        expect(acceptButton.innerHTML).contains('Accept analytics cookies');
    });

    it('should display reject cookie button', () => {
        const rejectButton = htmlRes.getElementsByClassName('cookie-banner-reject-button')[0];
        expect(rejectButton.innerHTML).contains('Reject analytics cookies');
    });

    it('should have the view cookies link', () => {
        const viewCookies = htmlRes.getElementsByTagName('a')[0];
        expect(viewCookies.getAttribute('href')).to.equal('/cookie-policy');
    });

    it('should show post button click message', () => {
        const acceptedMessage = htmlRes.getElementsByClassName('cookie-banner-accept-message')[0];
        expect(acceptedMessage.innerHTML).contains('You’ve accepted analytics cookies');
    });
});
