import { app } from '../../../main/app';
import { expect } from 'chai';
import request from 'supertest';

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
    },
    {
        title: 'Create new account',
        description: 'Create accounts for: CTSC Super Admin, Local Super Admin, CTSC Admin, Local Admin.',
        link: 'create-admin-account',
    },
    {
        title: 'User Management',
        description: 'Update and delete users.',
        link: 'admin-management',
    },
];
let htmlRes: Document;

describe('Admin Dashboard page all cards', () => {
    beforeAll(async () => {
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

    it('should display 5 links in banner', () => {
        const bannerComponents = htmlRes.getElementsByClassName('moj-sub-navigation__link');
        expect(bannerComponents.length).equal(5);

        expect(bannerComponents[0].innerHTML).equal('Home');
        expect(bannerComponents[1].innerHTML).equal('Upload');
        expect(bannerComponents[2].innerHTML).equal('Review apps');
        expect(bannerComponents[3].innerHTML).equal('Remove');
        expect(bannerComponents[4].innerHTML).equal('Sign out');
    });

    it('should display 5 card options', () => {
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
});

describe('Admin Dashboard page  - INTERNAL_SUPER_ADMIN_LOCAL', () => {
    beforeAll(async () => {
        app.request['user'] = { userId: '1', roles: 'INTERNAL_SUPER_ADMIN_LOCAL' };
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display 4 links in banner', () => {
        const bannerComponents = htmlRes.getElementsByClassName('moj-sub-navigation__link');
        expect(bannerComponents.length).equal(4);

        expect(bannerComponents[0].innerHTML).equal('Home');
        expect(bannerComponents[1].innerHTML).equal('Upload');
        expect(bannerComponents[2].innerHTML).equal('Remove');
        expect(bannerComponents[3].innerHTML).equal('Sign out');
    });

    it('should display 4 card options', () => {
        const cardComponents = htmlRes.getElementsByClassName('account-card');
        expect(cardComponents.length).equal(4);
    });
});

describe('Admin Dashboard page  - INTERNAL_ADMIN_CTSC', () => {
    beforeAll(async () => {
        app.request['user'] = { userId: '1', roles: 'INTERNAL_ADMIN_CTSC' };
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display 5 links in banner', () => {
        const bannerComponents = htmlRes.getElementsByClassName('moj-sub-navigation__link');
        expect(bannerComponents.length).equal(5);

        expect(bannerComponents[0].innerHTML).equal('Home');
        expect(bannerComponents[1].innerHTML).equal('Upload');
        expect(bannerComponents[2].innerHTML).equal('Review apps');
        expect(bannerComponents[3].innerHTML).equal('Remove');
        expect(bannerComponents[4].innerHTML).equal('Sign out');
    });

    it('should display 3 card options', () => {
        const cardComponents = htmlRes.getElementsByClassName('account-card');
        expect(cardComponents.length).equal(3);
    });
});

describe('Admin Dashboard page  - INTERNAL_ADMIN_LOCAL', () => {
    beforeAll(async () => {
        app.request['user'] = { userId: '1', roles: 'INTERNAL_ADMIN_LOCAL' };
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display 4 links in banner', () => {
        const bannerComponents = htmlRes.getElementsByClassName('moj-sub-navigation__link');
        expect(bannerComponents.length).equal(4);

        expect(bannerComponents[0].innerHTML).equal('Home');
        expect(bannerComponents[1].innerHTML).equal('Upload');
        expect(bannerComponents[2].innerHTML).equal('Remove');
        expect(bannerComponents[3].innerHTML).equal('Sign out');
    });

    it('should display 2 card options', () => {
        const cardComponents = htmlRes.getElementsByClassName('account-card');
        expect(cardComponents.length).equal(2);
    });
});

describe('Admin Dashboard page  - SYSTEM_ADMIN', () => {
    beforeAll(async () => {
        app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display 5 links in banner', () => {
        const bannerComponents = htmlRes.getElementsByClassName('moj-sub-navigation__link');
        expect(bannerComponents.length).equal(5);

        expect(bannerComponents[0].innerHTML).equal('Home');
        expect(bannerComponents[1].innerHTML).equal('Admin Dashboard');
        expect(bannerComponents[2].innerHTML).equal('Upload');
        expect(bannerComponents[3].innerHTML).equal('Remove');
        expect(bannerComponents[4].innerHTML).equal('Sign out');
    });

    it('should display 4 card options', () => {
        const cardComponents = htmlRes.getElementsByClassName('account-card');
        expect(cardComponents.length).equal(4);
    });
});
