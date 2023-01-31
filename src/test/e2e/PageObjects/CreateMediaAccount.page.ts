import { CommonPage } from './Common.page';
import { MediaAccountRequestSubmittedPage } from './MediaAccountRequestSubmitted.page';

const path = require('path');
const helpers = require('../Helpers/Selectors');

export class CreateMediaAccountPage extends CommonPage {
    async completeForm(): Promise<void> {
        await this.uploadImage();
        await this.inputName();
        await this.inputEmailAddress();
        await this.inputEmployer();
        await this.checkBox();
    }

    async uploadImage(): Promise<void> {
        $(helpers.UploadImage).catch(() => {
            console.log(`${helpers.UploadImage} not found`);
        });

        const filePath = path.join(__dirname, '../../unit/mocks/testFile.pdf');

        await $(helpers.UploadImage).setValue(filePath);
    }

    async inputName(): Promise<void> {
        $(helpers.NameInput).catch(() => {
            console.log(`${helpers.NameInput} not found`);
        });

        await $(helpers.NameInput).addValue('Joe Bloggs');
        await browser.keys('Escape');
    }

    async inputEmailAddress(): Promise<void> {
        $(helpers.EmailInput).catch(() => {
            console.log(`${helpers.EmailInput} not found`);
        });

        await $(helpers.EmailInput).addValue('joe.bloggs@hotmail.com');
        await browser.keys('Escape');
    }

    async inputEmployer(): Promise<void> {
        $(helpers.EmployerInput).catch(() => {
            console.log(`${helpers.EmployerInput} not found`);
        });

        await $(helpers.EmployerInput).addValue('Media Agency UK');
        await browser.keys('Escape');
    }

    async checkBox(): Promise<void> {
        await $(helpers.CheckBox).click();
    }

    async clickContinue(): Promise<MediaAccountRequestSubmittedPage> {
        await this.removeOverlay();
        $(helpers.ContinueButton).catch(() => {
            console.log(`${helpers.ContinueButton} not found`);
        });

        await $(helpers.ContinueButton).click();
        return new MediaAccountRequestSubmittedPage();
    }
}
