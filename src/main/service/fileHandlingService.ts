import { allowedFileTypes, allowedImageTypes, allowedCsvFileTypes, uploadType } from '../models/consts';
import fs from 'fs';
import { LanguageFileParser } from '../helpers/languageFileParser';

const { redisClient } = require('../cacheManager');
const languageFileParser = new LanguageFileParser();

export class FileHandlingService {
    REDIS_EXPIRY_KEY = 'EX';
    REDIS_EXPIRY_TIME = 60 * 10;

    validateImage(file: File, language: string, languageFile: string): string {
        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
        if (file) {
            if (this.isValidFileType(file['originalname'], uploadType.IMAGE)) {
                if (this.isFileCorrectSize(file.size)) {
                    return null;
                }
                return languageFileParser.getText(fileJson, 'imageUploadErrors', 'sizeError');
            }
            return languageFileParser.getText(fileJson, 'imageUploadErrors', 'typeError');
        }
        return languageFileParser.getText(fileJson, 'imageUploadErrors', 'blank');
    }

    validateFileUpload(file: File, language: string, languageFile: string, fileType: uploadType): string {
        const fileJson = languageFileParser.getLanguageFileJson(languageFile, language);
        if (file) {
            if (this.isFileCorrectSize(file.size)) {
                if (this.isValidFileType(file['originalname'], fileType)) {
                    return null;
                }
                return languageFileParser.getText(fileJson, 'fileUploadErrors', 'typeError');
            }
            return languageFileParser.getText(fileJson, 'fileUploadErrors', 'sizeError');
        }
        return languageFileParser.getText(fileJson, 'fileUploadErrors', 'blank');
    }

    /**
     * Sanitises the filename of the file being uploaded before being sent to the backend.
     * @param fileName The filename of the file being uploaded.
     */
    sanitiseFileName(fileName: string): string {
        let sanitisedFileName = '';

        [...fileName].forEach(char => {
            if (char.charCodeAt(0) <= 127) {
                sanitisedFileName += char;
            }
        });

        return sanitisedFileName;
    }

    readFile(fileName): object {
        try {
            if (this.getFileExtension(fileName) === 'json') {
                const rawData = fs.readFileSync(`./manualUpload/tmp/${fileName}`, 'utf-8');
                return JSON.parse(rawData);
            } else {
                return fs.readFileSync(`./manualUpload/tmp/${fileName}`);
            }
        } catch (err) {
            console.error(`Error while reading the file ${err}.`);
            return null;
        }
    }

    /**
     * Read in the raw data from a CSV file and convert to an array of rows where each row contains an array of fields
     * @param file Buffer of the raw data
     */
    readCsvToArray(file): string[][] {
        return file
            .toString()
            .split('\n')
            .map(e => e.trim())
            .filter(e => e.length > 0)
            .map(e => e.split(',').map(e => e.trim()));
    }

    /**
     * Stores an upload file into redis with an ID of the filename. It also removes the file from disk.
     * @param userId The user ID of the user uploading the file.
     * @param originalFilename The filename before being sanitised.
     * @param sanitisedFileName The filename of the file to store.
     */
    async storeFileIntoRedis(userId, originalFilename, sanitisedFileName) {
        try {
            if (this.getFileExtension(sanitisedFileName) === 'json') {
                const rawData = fs.readFileSync(`./manualUpload/tmp/${originalFilename}`, 'utf-8');
                await redisClient.set(
                    userId + '-' + sanitisedFileName,
                    JSON.stringify(JSON.parse(rawData)),
                    this.REDIS_EXPIRY_KEY,
                    this.REDIS_EXPIRY_TIME
                );
            } else {
                await redisClient.set(
                    userId + '-' + sanitisedFileName,
                    fs.readFileSync(`./manualUpload/tmp/${originalFilename}`, {
                        encoding: 'base64',
                    }),
                    this.REDIS_EXPIRY_KEY,
                    this.REDIS_EXPIRY_TIME
                );
            }
        } catch (err) {
            console.error(`Error while reading / storing the file in redis ${err}.`);
        }

        this.removeFile(originalFilename);
    }

    /**
     * Reads the file from redis.
     * @param userId The user that is reading the file.
     * @param fileName The filename of the file to store.
     */
    async readFileFromRedis(userId, fileName) {
        const fileData = await redisClient.get(userId + '-' + fileName);

        if (this.getFileExtension(fileName) === 'json') {
            return JSON.parse(fileData);
        } else {
            return Buffer.from(fileData, 'base64');
        }
    }

    /**
     * Removes a file from redis.
     * @param userId The user ID of the user who uploaded the file.
     * @param fileName The filename of the file uploaded.
     */
    removeFileFromRedis(userId, fileName) {
        redisClient.del(userId + '-' + fileName);
    }

    isValidFileType(fileName: string, type: uploadType): boolean {
        const fileType = fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2).toLocaleLowerCase();

        switch (type) {
            case uploadType.IMAGE: {
                return allowedImageTypes.includes(fileType);
            }
            case uploadType.FILE: {
                return allowedFileTypes.includes(fileType);
            }
            case uploadType.CSV: {
                return allowedCsvFileTypes.includes(fileType);
            }
            default:
                return false;
        }
    }

    isFileCorrectSize(fileSize: number): boolean {
        return fileSize <= 2000000;
    }

    removeFile(file): void {
        const filePath = `./manualUpload/tmp/${file}`;
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error(`Error while deleting ${file}.`);
        }
    }

    getFileExtension(fileName: string): string {
        const regex = /(?:\.([^.]+))?$/;
        return regex.exec(fileName)[1];
    }
}
