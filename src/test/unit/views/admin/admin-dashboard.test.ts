import { app } from '../../../../main/app';
import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { MediaAccountApplicationService } from '../../../../main/service/MediaAccountApplicationService';

const PAGE_URL = '/admin-dashboard';
const pageTitleValue = 'Staff dashboard';
const cards = [
    {
        title: 'Upload',
        description: 'Upload a file to be published on the external facing Court and tribunal hearings service.',
        link: 'manual-upload',
    },
    {
        title: 'Remove',
        description:
            'Search by court or tribunal and remove a publication from the external facing Court and tribunal hearings service.',
        link: 'remove-list-search',
    },
    {
        title: 'Manage media account request',
        description: 'CTSC assess new media account applications.',
        link: 'media-applications',
    }
];

let htmlRes: Document;

const mediaApplicationsStub = sinon.stub(MediaAccountApplicationService.prototype, 'getDateOrderedMediaApplications');
describe('Admin Dashboard page all cards', () => {
    describe('with one media application', () => {
        beforeAll(async () => {
            mediaApplicationsStub.resolves([{ id: '1' }]);
            app.request['user'] = { userId: '1', roles: 'INTERNAL_SUPER_ADMIN_CTSC' };
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains(pageTitleValue, 'Page title does not match header');
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(header[0].innerHTML).contains('Your Dashboard', 'Could not find correct value in header');
        });

        it('should display 2 links in banner', () => {
            const bannerComponents = htmlRes.getElementsByClassName('moj-sub-navigation__link');
            expect(bannerComponents.length).equal(2);

            expect(bannerComponents[0].innerHTML).equal('Home');
            expect(bannerComponents[1].innerHTML).equal('Sign out');
        });

        it('should display 3 card options', () => {
            const cardComponents = htmlRes.getElementsByClassName('account-card');
            expect(cardComponents.length).equal(cards.length);
        });

        it('cards should have correct content and links', () => {
            for (let i = 0; i < cards.length; i++) {
                const adminCards = htmlRes.getElementsByClassName('account-card');
                const link = adminCards[i].getElementsByTagName('a')[0];
                const description = adminCards[i].getElementsByTagName('p')[1];
                expect(link.innerHTML).contains(cards[i].title);
                expect(link.getAttribute('href')).contains(cards[i].link);
                expect(description.innerHTML).contains(cards[i].description);
            }
        });

        it('should contain notification banner', () => {
            const bannerHeadings = htmlRes.getElementsByClassName('govuk-notification-banner__heading');
            expect(bannerHeadings[0].innerHTML).contains('There is 1 outstanding media request.');

            const bannerLink = htmlRes.getElementById('banner-media-applications');
            expect(bannerLink.innerHTML).contains('Manage media account requests');
            expect(bannerLink.getAttribute('href')).contains('media-applications');
        });
    });

    describe('with multiple media applications', () => {
        beforeAll(async () => {
            mediaApplicationsStub.resolves([{ id: '1' }, { id: '2' }]);
            app.request['user'] = { userId: '1', roles: 'INTERNAL_SUPER_ADMIN_CTSC' };
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should contain notification banner', () => {
            const bannerHeadings = htmlRes.getElementsByClassName('govuk-notification-banner__heading');
            expect(bannerHeadings[0].innerHTML).contains('There are 2 outstanding media requests.');
        });
    });

    describe('with no media application', () => {
        beforeAll(async () => {
            mediaApplicationsStub.resolves([]);
            app.request['user'] = { userId: '1', roles: 'INTERNAL_SUPER_ADMIN_CTSC' };
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should not contain notification banner', () => {
            const bannerHeadings = htmlRes.getElementsByClassName('govuk-notification-banner__heading');
            expect(bannerHeadings).to.be.empty;
        });
    });
});

describe('Admin Dashboard page  - INTERNAL_SUPER_ADMIN_LOCAL', () => {
    beforeAll(async () => {
        mediaApplicationsStub.resolves([{ id: '1' }]);
        app.request['user'] = { userId: '1', roles: 'INTERNAL_SUPER_ADMIN_LOCAL' };
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display 2 links in banner', () => {
        const bannerComponents = htmlRes.getElementsByClassName('moj-sub-navigation__link');
        expect(bannerComponents.length).equal(2);

        expect(bannerComponents[0].innerHTML).equal('Home');
        expect(bannerComponents[1].innerHTML).equal('Sign out');
    });

    it('should display 2 card options', () => {
        const cardComponents = htmlRes.getElementsByClassName('account-card');
        expect(cardComponents.length).equal(2);
    });

    it('should not contain notification banner', () => {
        const bannerHeadings = htmlRes.getElementsByClassName('govuk-notification-banner__heading');
        expect(bannerHeadings).to.be.empty;
    });
});

describe('Admin Dashboard page  - INTERNAL_ADMIN_CTSC', () => {
    describe('with one media application', () => {
        beforeAll(async () => {
            mediaApplicationsStub.resolves([{ id: '1' }]);
            app.request['user'] = { userId: '1', roles: 'INTERNAL_ADMIN_CTSC' };
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display 2 links in banner', () => {
            const bannerComponents = htmlRes.getElementsByClassName('moj-sub-navigation__link');
            expect(bannerComponents.length).equal(2);

            expect(bannerComponents[0].innerHTML).equal('Home');
            expect(bannerComponents[1].innerHTML).equal('Sign out');
        });

        it('should display 3 card options', () => {
            const cardComponents = htmlRes.getElementsByClassName('account-card');
            expect(cardComponents.length).equal(3);
        });

        it('should contain notification banner', () => {
            const bannerHeadings = htmlRes.getElementsByClassName('govuk-notification-banner__heading');
            expect(bannerHeadings[0].innerHTML).contains('There is 1 outstanding media request.');
        });
    });

    describe('with multiple media applications', () => {
        beforeAll(async () => {
            mediaApplicationsStub.resolves([{ id: '1' }, { id: '2' }]);
            app.request['user'] = { userId: '1', roles: 'INTERNAL_SUPER_ADMIN_CTSC' };
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should contain notification banner', () => {
            const bannerHeadings = htmlRes.getElementsByClassName('govuk-notification-banner__heading');
            expect(bannerHeadings[0].innerHTML).contains('There are 2 outstanding media requests.');

            const bannerLink = htmlRes.getElementById('banner-media-applications');
            expect(bannerLink.innerHTML).contains('Manage media account requests');
            expect(bannerLink.getAttribute('href')).contains('media-applications');
        });
    });

    describe('with no media application', () => {
        beforeAll(async () => {
            mediaApplicationsStub.resolves([]);
            app.request['user'] = { userId: '1', roles: 'INTERNAL_SUPER_ADMIN_CTSC' };
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should not contain notification banner', () => {
            const bannerHeadings = htmlRes.getElementsByClassName('govuk-notification-banner__heading');
            expect(bannerHeadings).to.be.empty;
        });
    });
});

describe('Admin Dashboard page  - INTERNAL_ADMIN_LOCAL', () => {
    beforeAll(async () => {
        mediaApplicationsStub.resolves([{ id: '1' }]);
        app.request['user'] = { userId: '1', roles: 'INTERNAL_ADMIN_LOCAL' };
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display 2 links in banner', () => {
        const bannerComponents = htmlRes.getElementsByClassName('moj-sub-navigation__link');
        expect(bannerComponents.length).equal(2);

        expect(bannerComponents[0].innerHTML).equal('Home');
        expect(bannerComponents[1].innerHTML).equal('Sign out');
    });

    it('should display 2 card options', () => {
        const cardComponents = htmlRes.getElementsByClassName('account-card');
        expect(cardComponents.length).equal(2);
    });

    it('should not contain notification banner', () => {
        const bannerHeadings = htmlRes.getElementsByClassName('govuk-notification-banner__heading');
        expect(bannerHeadings).to.be.empty;
    });
});

describe('Admin Dashboard page  - SYSTEM_ADMIN', () => {
    beforeAll(async () => {
        mediaApplicationsStub.resolves([{ id: '1' }]);
        app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display 3 links in banner', () => {
        const bannerComponents = htmlRes.getElementsByClassName('moj-sub-navigation__link');
        expect(bannerComponents.length).equal(3);

        expect(bannerComponents[0].innerHTML).equal('Home');
        expect(bannerComponents[1].innerHTML).equal('Admin Dashboard');
        expect(bannerComponents[2].innerHTML).equal('Sign out');
    });

    it('should display 2 card options', () => {
        const cardComponents = htmlRes.getElementsByClassName('account-card');
        expect(cardComponents.length).equal(2);
    });

    it('should not contain notification banner', () => {
        const bannerHeadings = htmlRes.getElementsByClassName('govuk-notification-banner__heading');
        expect(bannerHeadings).to.be.empty;
    });
});
