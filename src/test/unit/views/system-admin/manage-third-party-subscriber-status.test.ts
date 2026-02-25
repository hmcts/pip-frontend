import { expect } from 'chai';
import nunjucks from 'nunjucks';

describe('manage-third-party-subscriber-status.njk', () => {
    const env = nunjucks.configure('src/main/views');
    env.addFilter('titleCase', function (str) {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    });
    const mockData = {
        title: 'Manage third party subscriber - Manage party subscriber status - Court and Tribunal Hearings - GOV.UK',
        header: 'Manage User Status',
        statusHeader: 'Status',
        userDetails: {
            userId: 'user123',
            status: 'ACTIVE',
        },
        statusOptions: ['PENDING', 'ACTIVE', 'SUSPENDED'],
        cspNonce: 'test-nonce',
    };

    let rendered;
    beforeAll(() => {
        rendered = env.render('system-admin/manage-third-party-subscriber-status.njk', mockData);
    });

    it('should render the page title and header', () => {
        expect(rendered).to.contain(mockData.title);
        expect(rendered).to.contain(mockData.header);
    });

    it('should render the form with hidden userId input', () => {
        expect(rendered).to.contain('<form method="post" action="/manage-third-party-subscriber-status">');
        expect(rendered).to.contain('<input type="hidden" name="userId" value="user123">');
    });

    it('should render the status select dropdown with correct options', () => {
        expect(rendered).to.contain('<select class="govuk-select" id="status" name="status">');
        mockData.statusOptions.forEach(option => {
            const display = option.charAt(0) + option.slice(1).toLowerCase();
            expect(rendered).to.contain(`<option value="${option}"`);
            expect(rendered).to.contain(`>${display}</option>`);
        });
    });

    it('should have the correct option selected', () => {
        expect(rendered).to.contain('<option value="ACTIVE" selected>Active</option>');
    });

    it('should render the Confirm and Cancel buttons', () => {
        expect(rendered).to.contain('<button type="submit" class="govuk-button">Confirm</button>');
        expect(rendered).to.contain(
            '<a href="/manage-third-party-subscribers/view?userId=user123" class="govuk-button govuk-button--warning" role="button">Cancel</a>'
        );
    });
});
