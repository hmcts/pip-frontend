import sinon from 'sinon';
import fs from 'fs';
import { multerFile } from '../mocks/multerFile';
import { FileHandlingService } from '../../../main/service/fileHandlingService';
import { uploadType } from '../../../main/models/consts';
const { redisClient } = require('../../../main/cacheManager');

const fileHandlingService = new FileHandlingService();
const validFileCase = multerFile('testFile.HtMl', 1000);
const largeFile = multerFile('testFile.docx', 3000000);
const validFile = multerFile('testFile.pdf', 1000);
const validImage = multerFile('testImage.png', 1000);
const largeImage = multerFile('testFile.png', 3000000);
const dotSeparatedFile = multerFile('t.e.s.t.f.i.l.e.png', 1000);
const invalidFileType = multerFile('testFile.xyz', 1000);
const noFileType = multerFile('testFile', 1000);
const userId = '1234';
const base64FileContent = 'VGhpcyBpcyBiYXNlIDY0';
const jsonContent = '{"TestContent": "TestValue"}';

const stub = sinon.stub(fs, 'unlinkSync');
const englishLanguage = 'en';
const createMediaAccountLanguageFile = 'create-media-account';
const manualUploadLanguageFile = 'manual-upload';

describe('File handling service', () => {
    describe('validateImage', () => {
        it('should return null if valid image is provided', () => {
            expect(fileHandlingService.validateImage(validImage, englishLanguage, createMediaAccountLanguageFile)).toBe(
                null
            );
        });

        it('should return null if a dot-separated image is provided', () => {
            expect(
                fileHandlingService.validateImage(dotSeparatedFile, englishLanguage, createMediaAccountLanguageFile)
            ).toBe(null);
        });

        it('should return error message if image is not provided', () => {
            expect(fileHandlingService.validateImage(null, englishLanguage, createMediaAccountLanguageFile)).toBe(
                'There is a problem - We will need ID evidence to support your application for an account'
            );
        });

        it('should return error message if unsupported format image is provided', () => {
            expect(
                fileHandlingService.validateImage(invalidFileType, englishLanguage, createMediaAccountLanguageFile)
            ).toBe('There is a problem - ID evidence must be a JPG, PDF or PNG');
        });

        it('should return error message if image is over 2MB', () => {
            expect(fileHandlingService.validateImage(largeImage, englishLanguage, createMediaAccountLanguageFile)).toBe(
                'There is a problem - ID evidence needs to be less than 2Mbs'
            );
        });
    });

    describe('validateFileUpload', () => {
        it('should return null when checking a valid file', () => {
            expect(
                fileHandlingService.validateFileUpload(
                    validFile,
                    englishLanguage,
                    manualUploadLanguageFile,
                    uploadType.FILE
                )
            ).toBe(null);
        });

        it('should return null when checking file type in different case sensitivity', () => {
            expect(
                fileHandlingService.validateFileUpload(
                    validFileCase,
                    englishLanguage,
                    manualUploadLanguageFile,
                    uploadType.FILE
                )
            ).toBe(null);
        });

        it('should return error message if file greater than 2MB', () => {
            expect(
                fileHandlingService.validateFileUpload(
                    largeFile,
                    englishLanguage,
                    manualUploadLanguageFile,
                    uploadType.FILE
                )
            ).toEqual('File too large, please upload file smaller than 2MB');
        });

        it('should return error message if invalid file type', () => {
            expect(
                fileHandlingService.validateFileUpload(
                    invalidFileType,
                    englishLanguage,
                    manualUploadLanguageFile,
                    uploadType.FILE
                )
            ).toEqual('Please upload a valid file format');
        });

        it('should return error message if missing file type', () => {
            expect(
                fileHandlingService.validateFileUpload(
                    noFileType,
                    englishLanguage,
                    manualUploadLanguageFile,
                    uploadType.FILE
                )
            ).toEqual('Please upload a valid file format');
        });

        it('should return error message if no file passed', () => {
            expect(
                fileHandlingService.validateFileUpload(null, englishLanguage, manualUploadLanguageFile, uploadType.FILE)
            ).toEqual('Please provide a file');
        });
    });

    describe('readFile', () => {
        it('should read a pdf file successfully', () => {
            const file = fileHandlingService.readFile('validationFile.pdf');
            expect(file).toBeInstanceOf(Buffer);
        });

        it('should read a json file successfully', () => {
            const file = fileHandlingService.readFile('validationJson.json');
            expect(file).toEqual({ name: 'this is valid json file' });
        });

        it('should return null if there is an error in reading a file', () => {
            const file = fileHandlingService.readFile('foo.pdf');
            expect(file).toEqual(null);
        });
    });

    describe('readCsvToArray', () => {
        it('should read a csv file successfully', () => {
            const file = fs.readFileSync('./manualUpload/tmp/bulkMediaUploadValidationFile.csv', 'utf-8');
            const rows = fileHandlingService.readCsvToArray(file);
            expect(rows).toHaveLength(4);

            const header = rows[0];
            expect(header).toHaveLength(3);
            expect(header).toStrictEqual(['column1', 'column2', 'column3']);
        });
    });

    describe('readFile from redis', () => {
        const getStub = sinon.stub(redisClient, 'get');
        it('should read a pdf file successfully', async () => {
            getStub.withArgs('1234-validationFile.pdf').resolves(base64FileContent);

            const fileBuffer = await fileHandlingService.readFileFromRedis(userId, 'validationFile.pdf');

            expect(fileBuffer.toString()).toEqual('This is base 64');
        });

        it('should read a json file successfully', async () => {
            getStub.withArgs('1234-validationJson.json').resolves(jsonContent);

            const file = await fileHandlingService.readFileFromRedis(userId, 'validationJson.json');
            expect(file).toEqual(JSON.parse(jsonContent));
        });
    });

    describe('storeFile in redis', () => {
        const setStub = sinon.stub(redisClient, 'set');
        it('should store a pdf file succesfully in redis', async () => {
            setStub.resolves('');

            await fileHandlingService.storeFileIntoRedis(userId, 'validationFile.pdf', 'validation.pdf');

            sinon.assert.calledWith(setStub, '1234-validation.pdf', sinon.match.any, 'EX', sinon.match.any);
        });

        it('should store a JSON file succesfully', async () => {
            setStub.resolves('');

            await fileHandlingService.storeFileIntoRedis(userId, 'validationJson.json', 'validation.json');

            sinon.assert.calledWith(setStub, '1234-validation.json', sinon.match.any, 'EX', sinon.match.any);
        });
    });

    describe('removeFile from redis', () => {
        it('should remove a file successfully', async () => {
            const deleteStub = sinon.stub(redisClient, 'del');
            deleteStub.withArgs('1234-validationFile.pdf').returns();

            await fileHandlingService.removeFileFromRedis(userId, 'validationFile.pdf');

            sinon.assert.calledWith(deleteStub, '1234-validationFile.pdf');
        });
    });

    describe('isValidFileType', () => {
        it('should return true for valid image type', () => {
            expect(fileHandlingService.isValidFileType('foo.jpg', uploadType.IMAGE)).toBe(true);
        });

        it('should return false for invalid image type', () => {
            expect(fileHandlingService.isValidFileType('bar.gif', uploadType.IMAGE)).toBe(false);
        });

        it('should return false for no image type', () => {
            expect(fileHandlingService.isValidFileType('buzz', uploadType.IMAGE)).toBe(false);
        });

        it('should return true for valid file type', () => {
            expect(fileHandlingService.isValidFileType('foo.pdf', uploadType.FILE)).toBe(true);
        });

        it('should return false for invalid image type', () => {
            expect(fileHandlingService.isValidFileType('bar.gif', uploadType.IMAGE)).toBe(false);
        });

        it('should return false for no file type', () => {
            expect(fileHandlingService.isValidFileType('pop', uploadType.FILE)).toBe(false);
        });

        it('should return true for dot separated image file', () => {
            expect(fileHandlingService.isValidFileType('f.i.l.e.png', uploadType.IMAGE)).toBe(true);
        });
    });

    describe('isFileCorrectSize', () => {
        it('should return true if file is less than 2MB', () => {
            expect(fileHandlingService.isFileCorrectSize(1000)).toEqual(true);
        });

        it('should return false if file is greater than 2MB', () => {
            expect(fileHandlingService.isFileCorrectSize(3000000)).toEqual(false);
        });
    });

    describe('removeFile', () => {
        it('should remove a file', () => {
            expect(fileHandlingService.removeFile(validImage)).toEqual(void 0);
            stub.restore();
        });

        it('should error when failing to delete a file', () => {
            stub.restore();
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
                ('');
            });
            fileHandlingService.removeFile(invalidFileType);
            expect(consoleSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('getFileExtension', () => {
        it('should return file type', () => {
            const fileType = fileHandlingService.getFileExtension('demo.pdf');
            expect(fileType).toEqual('pdf');
        });

        it('should return file type even if dot-separated filename', () => {
            const fileType = fileHandlingService.getFileExtension('f.i.l.e.n.a.m.e.png');
            expect(fileType).toEqual('png');
        });
    });

    describe('Test sanitise file name', () => {
        it('should santise the filename', () => {
            const fileName = fileHandlingService.sanitiseFileName('ThisIs—AFile');
            expect(fileName).toEqual('ThisIsAFile');
        });
    });
});
