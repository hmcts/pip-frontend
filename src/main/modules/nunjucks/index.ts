import * as path from 'path';
import * as express from 'express';
import * as nunjucks from 'nunjucks';
import fs from 'fs';

export class Nunjucks {
    constructor(public developmentMode: boolean) {
        this.developmentMode = developmentMode;
    }

    enableFor(app: express.Express): void {
        app.set('view engine', 'njk');
        const govUkFrontendPath = path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'govuk-frontend');
        const mojFrontendPath = path.join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'node_modules',
            '@ministryofjustice',
            'frontend'
        );
        const env = nunjucks.configure(
            [path.join(__dirname, '..', '..', 'views'), govUkFrontendPath, mojFrontendPath],
            {
                autoescape: true,
                watch: this.developmentMode,
                express: app,
            }
        );
        const addFilters = require('./njkFilters');
        addFilters(env);
        const gitBranchName = () => {
            try {
                const headFilePath = path.join(__dirname, '../../../../', '.git', 'HEAD');
                const headContents = fs.readFileSync(headFilePath, { encoding: 'utf8' });
                const refPath = headContents.trim().replace('ref: ', '');
                return path.basename(refPath);
            } catch (e) {
                return '';
            }
        };

        app.use((req, res, next) => {
            res.locals.pagePath = req.path;
            res.locals.lng = req['lng'];
            res.locals.branchName = gitBranchName();
            res.locals.env = process.env.NODE_ENV;
            next();
        });
    }
}
