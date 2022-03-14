import { CommonPage } from './Common.page';
import { ManualUploadSummaryPage } from './ManualUploadSummary.page';
const helpers = require('../Helpers/Selectors');

const path = require('path');

export class ManualUploadPage extends CommonPage {

  async getPageTitle(): Promise<string> {
    $(helpers.CommonPageTitleXl).catch(() => {
      console.log(`${helpers.CommonPageTitleXl} not found`);
    });

    return $(helpers.CommonPageTitleXl).getText();
  }

  async completeForm(): Promise<void> {
    await this.uploadFile();
    await this.inputCourt();
    await this.inputContentDateFrom();
    await this.inputDisplayDateFrom();
    await this.inputDisplayDateTo();
  }

  async uploadFile(): Promise<void> {
    $(helpers.fileUpload).catch(() => {
      console.log(`${helpers.fileUpload} not found`);
    });

    const filePath = path.join(__dirname, '../../unit/mocks/testFile.pdf');

    await $(helpers.fileUpload).setValue(filePath);
  }

  async inputCourt(): Promise<void> {
    $(helpers.SearchInput).catch(() => {
      console.log(`${helpers.SearchInput} not found`);
    });

    await $(helpers.SearchInput).addValue('Oxford Combined Court Centre');
    await browser.keys('Escape');
  }

  async inputContentDateFrom(): Promise<void> {
    $(helpers.contentDateFromDay).catch(() => {
      console.log(`${helpers.contentDateFromDay} not found`);
    });
    $(helpers.contentDateFromMonth).catch(() => {
      console.log(`${helpers.contentDateFromMonth} not found`);
    });
    $(helpers.contentDateFromYear).catch(() => {
      console.log(`${helpers.contentDateFromYear} not found`);
    });

    await $(helpers.contentDateFromDay).addValue('01');
    await $(helpers.contentDateFromMonth).addValue('01');
    await $(helpers.contentDateFromYear).addValue('2022');
  }

  async inputDisplayDateFrom(): Promise<void> {
    $(helpers.displayDateFromDay).catch(() => {
      console.log(`${helpers.displayDateFromDay} not found`);
    });
    $(helpers.displayDateFromMonth).catch(() => {
      console.log(`${helpers.displayDateFromMonth} not found`);
    });
    $(helpers.displayDateFromYear).catch(() => {
      console.log(`${helpers.displayDateFromYear} not found`);
    });

    await $(helpers.displayDateFromDay).addValue('01');
    await $(helpers.displayDateFromMonth).addValue('01');
    await $(helpers.displayDateFromYear).addValue('2022');
  }

  async inputDisplayDateTo(): Promise<void> {
    $(helpers.displayDateToDay).catch(() => {
      console.log(`${helpers.displayDateToDay} not found`);
    });
    $(helpers.displayDateToMonth).catch(() => {
      console.log(`${helpers.displayDateToMonth} not found`);
    });
    $(helpers.displayDateToYear).catch(() => {
      console.log(`${helpers.displayDateToYear} not found`);
    });

    await $(helpers.displayDateToDay).addValue('01');
    await $(helpers.displayDateToMonth).addValue('01');
    await $(helpers.displayDateToYear).addValue('2022');
  }

  async clickContinue(): Promise<ManualUploadSummaryPage> {
    $(helpers.ContinueButton).catch(() => {
      console.log(`${helpers.ContinueButton} not found`);
    });

    await $(helpers.ContinueButton).click();
    return new ManualUploadSummaryPage();
  }
}
