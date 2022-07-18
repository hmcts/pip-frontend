import {allowedFileTypes, allowedImageTypes} from '../models/consts';
import fs from 'fs';
const { redisClient } = require('../cacheManager');

export class FileHandlingService {

  REDIS_EXPIRY_KEY = 'EX';
  REDIS_EXPIRY_TIME = 60 * 10;

  validateImage(file: File): string {
    if (file) {
      if (this.isValidFileType(file['originalname'], true)) {
        if (this.isFileCorrectSize(file.size)) {
          return null;
        }
        return 'There is a problem - ID evidence needs to be less than 2Mbs';
      }
      return 'There is a problem - ID evidence must be a JPG, PDF or PNG';
    }
    return 'There is a problem - We will need ID evidence to support your application for an account';
  }

  validateFileUpload(file: File): string {
    if (file) {
      if (this.isValidFileType(file['originalname'], false)) {
        if (this.isFileCorrectSize(file.size)) {
          return null;
        }
        return 'File too large, please upload file smaller than 2MB';
      }
      return 'Please upload a valid file format';
    }
    return 'Please provide a file';
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
   * Stores an upload file into redis with an ID of the filename. It also removes the file from disk.
   * @param userId The user ID of the user uploading the file.
   * @param fileName The filename of the file to store.
   */
  async storeFileIntoRedis(userId, fileName) {
    try {
      if (this.getFileExtension(fileName) === 'json') {
        const rawData = fs.readFileSync(`./manualUpload/tmp/${fileName}`, 'utf-8');
        await redisClient.set(userId + "-" + fileName, JSON.stringify(JSON.parse(rawData)),
          this.REDIS_EXPIRY_KEY, this.REDIS_EXPIRY_TIME);
      } else {
        await redisClient.set(userId + "-" + fileName, fs.readFileSync(`./manualUpload/tmp/${fileName}`,
          {encoding: 'base64'}), this.REDIS_EXPIRY_KEY, this.REDIS_EXPIRY_TIME);
      }
    } catch (err) {
      console.error(`Error while reading / storing the file in redis ${err}.`);
    }

    this.removeFile(fileName);
  }

  /**
   * Reads the file from redis.
   * @param userId The user that is reading the file.
   * @param fileName The filename of the file to store.
   */
  async readFileFromRedis(userId, fileName) {
    const fileData = await redisClient.get(userId + "-" + fileName);

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
    redisClient.del(userId + "-" + fileName);
  }

  isValidFileType(fileName: string, image: boolean): boolean {
    const fileType = fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2).toLocaleLowerCase();
    return image ? allowedImageTypes.includes(fileType) : allowedFileTypes.includes(fileType);
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
