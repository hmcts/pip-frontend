import fs from 'fs';
import path from 'path';

export class LanguageFileParser {

  private getLanguageFileJson(fileName, language): string {
    const localesPath = '../resources/locales/' + language;
    const filePath = path.resolve(__dirname, localesPath, fileName + '.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  }

  public getText(language, fileName, parentNode, subNode): string {
    const fileJson = this.getLanguageFileJson(fileName, language);
    if(!parentNode) {
      return fileJson[subNode];
    } else {
      return fileJson[parentNode][subNode];
    }
  }
}
