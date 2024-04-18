import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import { Application } from 'express';
import path from 'path';
import * as fs from 'fs';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');

const jsonObject = {};
const controllerBasePath = '../../controllers';

export class Container {
    public enableFor(app: Application): void {

        const files = fs.readdirSync(path.join(__dirname, controllerBasePath));
        files.forEach(file => {
            if (path.extname(file)) {
                this.registerClass(file, controllerBasePath);
            } else {
                const filePath = `${controllerBasePath}/${file}`;
                const subDirFiles = fs.readdirSync(path.join(__dirname, filePath));
                subDirFiles.forEach(subDirFile => this.registerClass(subDirFile, filePath));
            }
        });
        jsonObject['logger'] = asValue(logger);
        app.locals.container = createContainer({
            injectionMode: InjectionMode.CLASSIC,
        }).register(jsonObject);
    }

    private registerClass(file: string, filePath: string): void {
        const controllerName = file.slice(0, -3);
        const registerName = controllerName.charAt(0).toLowerCase() + controllerName.slice(1);
        const clazz = require(`${filePath}/${controllerName}`);
        jsonObject[registerName] = asClass(clazz.default);
    }
}
