import { expect } from 'chai';
import nunjucks from 'nunjucks';

describe('manage-third-party-subscriber-status-success.njk', () => {
    const env = nunjucks.configure('src/main/views');
    const mockData = {
        title: 'Manage third party subscriber - Manage party subscriber status - Court and Tribunal Hearings - GOV.UK',
        header: ' Third Party Account Status Updated',
        panelBodyMessage: ' Third party account status has been successfully updated.',
        nextMessage: 'To further update third party account, you can go to:',
        manageThirdPartySubscriber: 'Manage third party subscriber',
        cspNonce: 'test-nonce',
    };

    let rendered;
    beforeAll(() => {
        rendered = env.render('system-admin/manage-third-party-subscriber-status-success.njk', mockData);
    });

    it('should render the page title', () => {
        expect(rendered).to.contain(mockData.title);
    });

    it('should render the success panel with header and message', () => {
        expect(rendered).to.contain(mockData.header);
        expect(rendered).to.contain(mockData.panelBodyMessage);
    });

    it('should render the next message', () => {
        expect(rendered).to.contain(mockData.nextMessage);
    });

    it('should render the manage third party subscriber link', () => {
        expect(rendered).to.contain(
            '<a class="govuk-link govuk-!-margin-left-1" href="manage-third-party-subscribers">'
        );
        expect(rendered).to.contain(mockData.manageThirdPartySubscriber);
    });
});
