import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';
import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import { describe } from '@jest/globals';

const testList = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../mocks/sjp/minimalSjpPublicList.json'), 'utf-8')
);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(testList);
sinon.stub(LocationService.prototype, 'getLocationById').returns({ name: 'Test court 100' });

const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const publicJsonMetadata = JSON.parse(rawMetadata)[1];
const privateJsonMetadata = JSON.parse(rawMetadata)[1];
privateJsonMetadata.sensitivity = 'PRIVATE';
const classifiedJsonMetadata = JSON.parse(rawMetadata)[1];
classifiedJsonMetadata.sensitivity = 'CLASSIFIED';

const publicFlatFileMetadata = JSON.parse(rawMetadata)[1];
publicFlatFileMetadata.isFlatFile = true;
const privateFlatFileMetadata = JSON.parse(rawMetadata)[1];
privateFlatFileMetadata.sensitivity = 'PRIVATE';
privateFlatFileMetadata.isFlatFile = true;
const classifiedFlatFileMetadata = JSON.parse(rawMetadata)[1];
classifiedFlatFileMetadata.sensitivity = 'CLASSIFIED';
classifiedFlatFileMetadata.isFlatFile = true;

const noMatchMetadata = JSON.parse(rawMetadata)[1];
noMatchMetadata.locationId = 'NoMatch123';

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs('1').resolves(publicJsonMetadata);
metadataStub.withArgs('2').resolves(privateJsonMetadata);
metadataStub.withArgs('3').resolves(classifiedJsonMetadata);

metadataStub.withArgs('4').resolves(publicFlatFileMetadata);
metadataStub.withArgs('5').resolves(privateFlatFileMetadata);
metadataStub.withArgs('6').resolves(classifiedFlatFileMetadata);

metadataStub.withArgs('7').resolves(noMatchMetadata);

const publicSensitivity = 'Public';
const privateSensitivity = 'Private';
const classifiedSensitivity = 'Classified';

const sensitivityResourceMap = new Map<string, any>([
    [
        publicSensitivity,
        {
            artefactIdJson: '1',
            artefactIdFlatFile: '4',
        },
    ],
    [
        privateSensitivity,
        {
            artefactIdJson: '2',
            artefactIdFlatFile: '5',
        },
    ],
    [
        classifiedSensitivity,
        {
            artefactIdJson: '3',
            artefactIdFlatFile: '6',
        },
    ],
]);


const headingClass = 'govuk-heading-l';
const subHeadingClass = 'govuk-heading-m';
const summaryListClass = 'govuk-summary-list';
const summaryListRowClass = 'govuk-summary-list__row';
const summaryListRowKeyClass = 'govuk-summary-list__key';
const summaryListRowValueClass = 'govuk-summary-list__value';
const linkClass = 'govuk-link';
const detailsSummaryTextClass = 'govuk-details__summary-text';
const jsonContainerClass = 'json-container';
const resubmitSubscriptionId = 'resubmit-subscription';

let htmlRes: Document;

describe('Blob explorer publication page', () => {
    describe('for existed location', () => {
        describe.each([publicSensitivity, privateSensitivity, classifiedSensitivity])("with JSON publication of '%s' sensitivity", sensitivity => {
            beforeAll(async () => {
                app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };

                await request(app)
                    .get('/blob-view-publication?artefactId='
                        + sensitivityResourceMap.get(sensitivity).artefactIdJson)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display the heading - prefix', () => {
                const header = htmlRes.getElementsByClassName(headingClass);
                expect(header[0].innerHTML).contains('Blob Explorer', 'Could not find the header');
            });

            it('should display the heading - file type', () => {
                const header = htmlRes.getElementsByClassName(headingClass);
                expect(header[0].innerHTML).contains('JSON file', 'Could not find the header');
            });

            it('should display the sub heading', () => {
                const subHeading = htmlRes.getElementsByClassName(subHeadingClass);
                expect(subHeading[1].innerHTML).contains('Metadata', 'Could not find the sub heading');
            });

            it('should have a summary list of the meta data on the page', () => {
                const summaryList = htmlRes.getElementsByClassName(summaryListClass)[0];
                expect(summaryList).to.exist;
            });

            it('should have the artefact id row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[0];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Artefact ID', 'Could not find row key');
                expect(rowValue.innerHTML).contains('745', 'Could not find row value');
            });

            it('should have the location id row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[1];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Location ID', 'Could not find row key');
                expect(rowValue.innerHTML).contains('123', 'Could not find row value');
            });

            it('should have the location name row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[2];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Location Name', 'Could not find row key');
                expect(rowValue.innerHTML).contains('Test court 100', 'Could not find row value');
            });

            it('should have the publication type row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[3];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Publication Type', 'Could not find row key');
                expect(rowValue.innerHTML).contains('General_publication', 'Could not find row value');
            });

            it('should have the list type row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[4];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('List Type', 'Could not find row key');
                expect(rowValue.innerHTML).contains('Single Justice Procedure Public List', 'Could not find row value');
            });

            it('should have the provenance row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[5];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Provenance', 'Could not find row key');
                expect(rowValue.innerHTML).contains('prov2', 'Could not find row value');
            });

            it('should have the language row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[6];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Language', 'Could not find row key');
                expect(rowValue.innerHTML).contains('English', 'Could not find row value');
            });

            it('should have the sensitivity row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[7];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Sensitivity', 'Could not find row key');
                expect(rowValue.innerHTML).contains(sensitivity, 'Could not find row value');
            });

            it('should have the content date row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[8];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Content Date', 'Could not find row key');
                expect(rowValue.innerHTML).contains('14th February 2022 at 02:14 pm', 'Could not find row value');
            });

            it('should have the display from row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[9];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Display From', 'Could not find row key');
                expect(rowValue.innerHTML).contains(' 14th February 2022 at 02:14 pm', 'Could not find row value');
            });

            it('should have the display to row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[10];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Display To', 'Could not find row key');
                expect(rowValue.innerHTML).contains('14th February 2052 at 02:14 pm', 'Could not find row value');
            });

            it('should display the link to the template', () => {
                const link = htmlRes.getElementsByClassName(linkClass)[5];
                expect(link.innerHTML).contains('Link to rendered template', 'Could not find the link to the template');
            });

            it('should have the correct href to the template', () => {
                const link = htmlRes.getElementsByClassName(linkClass)[5];
                expect(link.outerHTML).contains(
                    '/sjp-public-list?artefactId=' + sensitivityResourceMap.get(sensitivity).artefactIdJson,
                    'Could not find the link to the template'
                );
            });

            it('should have the details dropdown for viewing the json content', () => {
                const detailsSummaryText = htmlRes.getElementsByClassName(detailsSummaryTextClass)[0];
                expect(detailsSummaryText.innerHTML).contains('View Raw JSON Content', 'Could not find details dropdown');
            });

            it('should have the json container on the page', () => {
                const jsonContainer = htmlRes.getElementsByClassName(jsonContainerClass)[0];
                expect(jsonContainer).to.exist;
            });

            it('should have the correct data in the json container', () => {
                const jsonContainer = htmlRes.getElementsByClassName(jsonContainerClass)[0];

                expect(jsonContainer.innerHTML).contains('{', 'Could not find correct json output on the line');
                expect(jsonContainer.innerHTML).contains(
                    'publicationDate',
                    'Could not find correct json output on the line'
                );
                expect(jsonContainer.innerHTML).contains('documentName', 'Could not find correct json output on the line');
            });

            it('should display the re-submit subscription button', () => {
                const button = htmlRes.getElementById(resubmitSubscriptionId);
                expect(button).to.exist;
                expect(button.innerHTML).contains('Re-submit subscription', 'Button text does not match');
            });
        });

        describe.each([publicSensitivity, privateSensitivity, classifiedSensitivity])("with flat file publication of '%s' sensitivity", sensitivity => {
            beforeAll(async () => {
                app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };

                await request(app)
                    .get('/blob-view-publication?artefactId='
                        + sensitivityResourceMap.get(sensitivity).artefactIdFlatFile)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display the heading - prefix', () => {
                const header = htmlRes.getElementsByClassName(headingClass);
                expect(header[0].innerHTML).contains('Blob Explorer', 'Could not find the header');
            });

            it('should display the heading - file type', () => {
                const header = htmlRes.getElementsByClassName(headingClass);
                expect(header[0].innerHTML).contains('Flat file', 'Could not find the header');
            });

            it('should display the sub heading', () => {
                const subHeading = htmlRes.getElementsByClassName(subHeadingClass);
                expect(subHeading[1].innerHTML).contains('Metadata', 'Could not find the sub heading');
            });

            it('should have a summary list of the meta data on the page', () => {
                const summaryList = htmlRes.getElementsByClassName(summaryListClass)[0];
                expect(summaryList).to.exist;
            });

            it('should have the artefact id row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[0];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Artefact ID', 'Could not find row key');
                expect(rowValue.innerHTML).contains('745', 'Could not find row value');
            });

            it('should have the location id row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[1];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Location ID', 'Could not find row key');
                expect(rowValue.innerHTML).contains('123', 'Could not find row value');
            });

            it('should have the location name row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[2];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Location Name', 'Could not find row key');
                expect(rowValue.innerHTML).contains('Test court 100', 'Could not find row value');
            });

            it('should have the publication type row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[3];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Publication Type', 'Could not find row key');
                expect(rowValue.innerHTML).contains('General_publication', 'Could not find row value');
            });

            it('should have the list type row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[4];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('List Type', 'Could not find row key');
                expect(rowValue.innerHTML).contains('Single Justice Procedure Public List', 'Could not find row value');
            });

            it('should have the provenance row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[5];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Provenance', 'Could not find row key');
                expect(rowValue.innerHTML).contains('prov2', 'Could not find row value');
            });

            it('should have the language row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[6];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Language', 'Could not find row key');
                expect(rowValue.innerHTML).contains('English', 'Could not find row value');
            });

            it('should have the sensitivity row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[7];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Sensitivity', 'Could not find row key');
                expect(rowValue.innerHTML).contains(sensitivity, 'Could not find row value');
            });

            it('should have the content date row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[8];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Content Date', 'Could not find row key');
                expect(rowValue.innerHTML).contains('14th February 2022 at 02:14 pm', 'Could not find row value');
            });

            it('should have the display from row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[9];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Display From', 'Could not find row key');
                expect(rowValue.innerHTML).contains(' 14th February 2022 at 02:14 pm', 'Could not find row value');
            });

            it('should have the display to row in the summary list', () => {
                const summaryListRow = htmlRes.getElementsByClassName(summaryListRowClass)[10];
                const rowKey = summaryListRow.getElementsByClassName(summaryListRowKeyClass)[0];
                const rowValue = summaryListRow.getElementsByClassName(summaryListRowValueClass)[0];

                expect(summaryListRow).to.exist;
                expect(rowKey.innerHTML).contains('Display To', 'Could not find row key');
                expect(rowValue.innerHTML).contains('14th February 2052 at 02:14 pm', 'Could not find row value');
            });

            it('should display the link to flat file', () => {
                const link = htmlRes.getElementsByClassName(linkClass)[5];
                expect(link.innerHTML).contains('Link to file', 'Could not find the link to flat file');
            });

            it('should have the correct href to the template', () => {
                const link = htmlRes.getElementsByClassName(linkClass)[5];
                expect(link.outerHTML).contains(
                    '/file-publication?artefactId=' + sensitivityResourceMap.get(sensitivity).artefactIdFlatFile,
                    'URL to the flat file does not match'
                );
            });

            it('should not have the details dropdown for viewing the json content', () => {
                const detailsSummaryText = htmlRes.getElementsByClassName(detailsSummaryTextClass)[0];
                expect(detailsSummaryText).is.undefined
            });

            it('should display the re-submit subscription button', () => {
                const button = htmlRes.getElementById(resubmitSubscriptionId);
                expect(button).to.exist;
                expect(button.innerHTML).contains('Re-submit subscription', 'Button text does not match');
            });
        });
    });

    describe('for no match location', () => {
        beforeAll(async () => {
            app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };

            await request(app)
                .get('/blob-view-publication?artefactId=7')
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should not display the re-submit subscription button', () => {
            const button = htmlRes.getElementById(resubmitSubscriptionId);
            expect(button).to.be.null;
        });
    });
});
