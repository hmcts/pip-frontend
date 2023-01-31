import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import { Application } from 'express';
import path from 'path';
import * as fs from 'fs';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');

export class Container {
    public enableFor(app: Application): void {
        const jsonObject = {};

        const files = fs.readdirSync(path.join(__dirname, '../../controllers'));
        files.forEach(f => {
            const controllerName = f.slice(0, -3);
            const registerName = controllerName.charAt(0).toLowerCase() + controllerName.slice(1);
            const clazz = require('../../controllers/' + controllerName);
            jsonObject[registerName] = asClass(clazz.default);
        });
        jsonObject['logger'] = asValue(logger);
        app.locals.container = createContainer({
            injectionMode: InjectionMode.CLASSIC,
        }).register(jsonObject);
    }
}
