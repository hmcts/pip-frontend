import { PublicationRequests } from '../resources/requests/PublicationRequests';
import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';
import { SubscriptionRequests } from '../resources/requests/SubscriptionRequests';
import ExcelJS from 'exceljs';

const publicationRequests = new PublicationRequests();
const accountManagementRequests = new AccountManagementRequests();
const subscriptionRequests = new SubscriptionRequests();

export interface GeneratedCsvFile {
    fileName: string;
    buffer: Buffer;
}

const allTimeReportDurationLabel = 'all_time';
export class DownloadMiReportService {
    public async generatePublicationMiData(reportType: string, reportDuration: number): Promise<GeneratedCsvFile> {
        const returnedData = await publicationRequests.getMiPublicationData(reportDuration);
        return this.buildGeneratedCsvFile(returnedData, reportType, reportDuration.toString());
    }

    public async generateUserAccountsMiData(reportType: string): Promise<GeneratedCsvFile> {
        const returnedData = await accountManagementRequests.getMiAccountsData();
        return this.buildGeneratedCsvFile(returnedData, reportType, allTimeReportDurationLabel);
    }

    public async generateAllSubscriptionsMiData(reportType: string): Promise<GeneratedCsvFile> {
        const returnedData = await subscriptionRequests.getMiAllSubscriptionsData();
        return this.buildGeneratedCsvFile(returnedData, reportType, allTimeReportDurationLabel);
    }

    public async generateLocationSubscriptionsMiData(reportType: string): Promise<GeneratedCsvFile> {
        const returnedData = await subscriptionRequests.getMiLocationSubscriptionsData();
        return this.buildGeneratedCsvFile(returnedData, reportType, allTimeReportDurationLabel);
    }

    public async generateAllDataMiData(reportType: string, reportDuration: number): Promise<GeneratedCsvFile> {
        const publications = await publicationRequests.getMiPublicationData(reportDuration);

        const accounts = await accountManagementRequests.getMiAccountsData();

        const allSubscriptions = await subscriptionRequests.getMiAllSubscriptionsData();

        const locationSubscriptions = await subscriptionRequests.getMiLocationSubscriptionsData();

        const workbook = new ExcelJS.Workbook();

        this.addWorksheet(workbook, 'Publications', publications as Record<string, any>[]);

        this.addWorksheet(workbook, 'User Accounts', accounts as Record<string, any>[]);

        this.addWorksheet(workbook, 'All Subscriptions', allSubscriptions as Record<string, any>[]);

        this.addWorksheet(workbook, 'Location Subscriptions', locationSubscriptions as Record<string, any>[]);

        const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

        return {
            fileName: this.generateFileName(reportType, reportDuration.toString()).replace('.csv', '.xlsx'),
            buffer,
        };
    }

    private addWorksheet(workbook: ExcelJS.Workbook, sheetName: string, data: Record<string, any>[]): void {
        const worksheet = workbook.addWorksheet(sheetName);

        if (!data?.length) {
            return;
        }

        // Add headers
        worksheet.columns = Object.keys(data[0]).map(key => ({
            header: key,
            key,
        }));

        // Add rows
        worksheet.addRows(data);
    }

    private buildGeneratedCsvFile(returnedData: object, reportType: string, reportDuration: string): GeneratedCsvFile {
        const data = returnedData as Record<string, any>[];
        return {
            fileName: this.generateFileName(reportType, reportDuration),
            buffer: this.generateCsvBuffer(data),
        };
    }

    /**
     * Generate CSV buffer from object array
     */
    private generateCsvBuffer(data: Record<string, any>[]): Buffer {
        const csv = this.convertToCSV(data);
        return this.convertToBuffer(csv);
    }

    /**
     * Convert object array into CSV string
     */
    private convertToCSV(data: Record<string, any>[]): string {
        if (!data?.length) {
            return '';
        }
        // CSV headers
        const headers = Object.keys(data[0]).join(',');
        // CSV rows
        const rows = data.map(row =>
            Object.values(row)
                .map(value => `"${String(value ?? '').replace(/"/g, '""')}"`)
                .join(',')
        );
        return [headers, ...rows].join('\n');
    }

    /**
     * Convert CSV string into UTF-8 buffer
     */
    private convertToBuffer(csv: string): Buffer {
        const csvWithBom = '\uFEFF' + csv;
        return Buffer.from(csvWithBom, 'utf-8');
    }

    /**
     * Generate dynamic file name
     */
    private generateFileName(reportType: string, reportDuration: string): string {
        const now = new Date();

        const datePart = now.toISOString().split('T')[0].replace(/-/g, '_');

        const timePart =
            String(now.getHours()).padStart(2, '0') +
            String(now.getMinutes()).padStart(2, '0') +
            String(now.getSeconds()).padStart(2, '0') +
            String(now.getMilliseconds()).padStart(3, '0');

        return `${reportType}_report_${reportDuration}days_${datePart}_${timePart}.csv`;
    }
}
